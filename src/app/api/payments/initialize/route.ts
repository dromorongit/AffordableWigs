import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order, { IOrderItem, ICustomerInfo } from "@/models/Order";
import Product from "@/models/Product";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";
import { validateInput, paymentInitSchema } from "@/lib/validation";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { STYLING_OPTIONS } from "@/constants";

const paystack = PaystackLib(process.env.PAYSTACK_SECRET_KEY!);

function getProductionSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;

  console.log("[Paystack Init DEBUG] NEXT_PUBLIC_SITE_URL raw value:", raw);

  if (!raw) {
    const msg = "NEXT_PUBLIC_SITE_URL is not set. Set it in Railway to https://affordablewigs-production.up.railway.app";
    console.error("[Paystack Init DEBUG] FATAL:", msg);
    throw new Error(msg);
  }

  if (
    raw.includes("localhost") ||
    raw.includes("127.0.0.1") ||
    raw.includes("0.0.0.0")
  ) {
    const msg = `NEXT_PUBLIC_SITE_URL points to a local address (${raw}). Set it to https://affordablewigs-production.up.railway.app in Railway.`;
    console.error("[Paystack Init DEBUG] FATAL:", msg);
    throw new Error(msg);
  }

  if (!raw.startsWith("https://")) {
    const msg = `NEXT_PUBLIC_SITE_URL must use https:// (got: ${raw}). Set it to https://affordablewigs-production.up.railway.app in Railway.`;
    console.error("[Paystack Init DEBUG] FATAL:", msg);
    throw new Error(msg);
  }

  return raw.replace(/\/+$/, "");
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AWG-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.PAYMENT);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validation = validateInput(paymentInitSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { customer, items, subtotal, stylingTotal = 0, total, currency } = validation.data!;

    const frontendTotal = total;
    const expectedTotal = subtotal + stylingTotal;

    if (Math.abs(frontendTotal - expectedTotal) > 0.01) {
      console.error("[Payment Init] Frontend total mismatch. Expected:", expectedTotal, "Got:", frontendTotal);
      return NextResponse.json(
        { message: "Invalid totals. Please refresh and try again." },
        { status: 400 }
      );
    }

    const serverStylingTotal = stylingTotal || 0;
    const serverSubtotal = subtotal || 0;
    const serverTotal = serverSubtotal + serverStylingTotal;

    console.log("[Payment Init] Starting payment for order, customer:", customer.email);

    const orderItems: IOrderItem[] = items.map((item) => {
      const stylingId = item.stylingType || "none";
      const stylingOption = STYLING_OPTIONS.find((s) => s.id === stylingId) || STYLING_OPTIONS[0];
      return {
        productId: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        quantity: item.quantity,
        mainImage: item.product.mainImage,
        stylingType: stylingOption.id,
        stylingName: stylingOption.name,
        stylingPrice: stylingOption.price,
      };
    });

    const orderNumber = generateOrderNumber();

    console.log("[Payment Init] Validating stock for", orderItems.length, "item(s)");
    const outOfStockItems: string[] = [];
    const insufficientStockItems: { name: string; requested: number; available: number }[] = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }
      if (product.stockQuantity < item.quantity) {
        insufficientStockItems.push({
          name: item.name,
          requested: item.quantity,
          available: product.stockQuantity,
        });
      } else if (product.stockQuantity === 0) {
        outOfStockItems.push(item.name);
      }
    }

    if (outOfStockItems.length > 0) {
      console.error("[Payment Init] Out of stock:", outOfStockItems);
      return NextResponse.json(
        {
          message: `The following item(s) are out of stock: ${outOfStockItems.join(", ")}. Please remove them from your cart.`,
        },
        { status: 400 }
      );
    }

    if (insufficientStockItems.length > 0) {
      const details = insufficientStockItems
        .map((i) => `${i.name} (requested: ${i.requested}, available: ${i.available})`)
        .join(", ");
      console.error("[Payment Init] Insufficient stock:", details);
      return NextResponse.json(
        {
          message: `Insufficient stock for: ${details}. Please reduce quantities in your cart.`,
        },
        { status: 400 }
      );
    }

    console.log("[Payment Init] Stock validation passed for all items");

    const amountInKobo = Math.round(serverTotal * 100);

    const siteUrl = getProductionSiteUrl();
    const paystackReference = `${orderNumber}-${Date.now()}`;
    const callbackUrl = `${siteUrl}/checkout/success?reference=${encodeURIComponent(paystackReference)}&order=${encodeURIComponent(orderNumber)}`;

    console.log("[Paystack Init DEBUG] siteUrl:", siteUrl);
    console.log("[Paystack Init DEBUG] callback_url being sent to Paystack:", callbackUrl);
    console.log("[Paystack Init DEBUG] orderNumber:", orderNumber);
    console.log("[Paystack Init DEBUG] paystackReference:", paystackReference);
    console.log("[Paystack Init DEBUG] amountInKobo:", amountInKobo);
    console.log("[Paystack Init DEBUG] customer email:", customer.email);

    const transaction = await paystack.transaction.initialize({
      amount: amountInKobo,
      email: customer.email,
      name: customer.fullName,
      currency: "GHS",
      reference: paystackReference,
      callback_url: callbackUrl,
      metadata: {
        orderNumber,
        custom_fields: [
          {
            display_name: "Order Number",
            variable_name: "order_number",
            value: orderNumber,
          },
        ],
      },
    });

    console.log("[Paystack Init DEBUG] Paystack response status:", transaction.status);
    console.log("[Paystack Init DEBUG] Paystack response message:", transaction.message);

    if (!transaction.status) {
      console.error("[Paystack Init DEBUG] Paystack initialization FAILED:", transaction.message);
      return NextResponse.json(
        { message: "Failed to initialize payment. Please try again." },
        { status: 500 }
      );
    }

    console.log("[Paystack Init DEBUG] Paystack initialization SUCCESS");
    console.log("[Paystack Init DEBUG] authorization_url:", transaction.data.authorization_url);
    console.log("[Paystack Init DEBUG] reference:", transaction.data.reference);

    await connectDB();

    const newOrder = new Order({
      orderNumber,
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        deliveryAddress: customer.deliveryAddress,
        cityOrTown: customer.cityOrTown,
        regionOrArea: customer.regionOrArea,
        orderNotes: customer.orderNotes || "",
      } as ICustomerInfo,
      items: orderItems,
      subtotal: serverSubtotal,
      stylingTotal: serverStylingTotal,
      total: serverTotal,
      currency: currency || "GHS",
      paymentReference: transaction.data.reference,
      paymentStatus: "pending",
      orderStatus: "Processing",
      userId: (await getCurrentCustomer())?.id || undefined,
      stockDeducted: false,
    });

    await newOrder.save();

    console.log("[Paystack Init DEBUG] Order saved to DB:", orderNumber);
    console.log("[Paystack Init DEBUG] Order paymentReference:", newOrder.paymentReference);
    console.log("[Paystack Init DEBUG] Order paymentStatus:", newOrder.paymentStatus);
    console.log("[Paystack Init DEBUG] Order subtotal:", newOrder.subtotal, "stylingTotal:", serverStylingTotal, "total:", newOrder.total);

    return NextResponse.json({
      success: true,
      authorizationUrl: transaction.data.authorization_url,
      reference: transaction.data.reference,
      orderNumber,
    });
  } catch (error) {
    console.error("[Payment Init] Error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
