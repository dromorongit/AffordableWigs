import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order, { IOrderItem, ICustomerInfo } from "@/models/Order";
import Product from "@/models/Product";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";
import { validateInput, paymentInitSchema } from "@/lib/validation";
import { getCurrentCustomer } from "@/lib/customerAuth";

// Initialize Paystack with secret key
const paystack = PaystackLib(process.env.PAYSTACK_SECRET_KEY!);

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AWG-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.PAYMENT);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        }
      }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(paymentInitSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { customer, items, subtotal, total, currency } = validation.data!;

    console.log("[Payment Init] Starting payment for order, customer:", customer.email);

    // Convert cart items to order items
    const orderItems: IOrderItem[] = items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      quantity: item.quantity,
      mainImage: item.product.mainImage,
    }));

    // Generate order number
    const orderNumber = generateOrderNumber();

    // ── Inventory Safety: Validate sufficient stock before creating order ──
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

    // Calculate amount in kobo (Paystack uses kobo for GHS)
    const amountInKobo = Math.round(total * 100);

    // Initialize Paystack transaction
    const transaction = await paystack.transaction.initialize({
      amount: amountInKobo,
      email: customer.email,
      name: customer.fullName,
      currency: "GHS",
      reference: `${orderNumber}-${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
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

    if (!transaction.status) {
      console.error("[Payment Init] Paystack initialization failed:", transaction.message);
      return NextResponse.json(
        { message: "Failed to initialize payment. Please try again." },
        { status: 500 }
      );
    }

    // Pre-create order with pending payment status
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
      subtotal,
      total,
      currency: currency || "GHS",
      paymentReference: transaction.data.reference,
      paymentStatus: "pending",
      orderStatus: "Processing",
      userId: (await getCurrentCustomer())?.id || undefined,
      stockDeducted: false,
    });

    await newOrder.save();

    console.log("[Payment Init] Order pre-created:", orderNumber, "with reference:", transaction.data.reference);

    // Return authorization URL and order reference
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