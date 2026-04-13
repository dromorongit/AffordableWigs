import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order, { IOrderItem, ICustomerInfo } from "@/models/Order";

// Initialize Paystack with secret key
const paystack = PaystackLib(process.env.PAYSTACK_SECRET_KEY);

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AWG-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { customer, items, subtotal, total, currency } = body;

    // Validate required fields
    if (!customer || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate customer info
    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.email ||
      !customer.deliveryAddress ||
      !customer.cityOrTown ||
      !customer.regionOrArea
    ) {
      return NextResponse.json(
        { message: "Complete delivery information is required" },
        { status: 400 }
      );
    }

    // Convert cart items to order items
    const orderItems: IOrderItem[] = items.map((item: any) => ({
      productId: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      quantity: item.quantity,
      mainImage: item.product.mainImage,
    }));

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Calculate amount in kobo (Paystack uses kobo for GHS)
    const amountInKobo = Math.round(total * 100);

    // Initialize Paystack transaction
    const transaction = await paystack.transaction.initialize({
      amount: amountInKobo,
      email: customer.email,
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
      console.error("Paystack initialization failed:", transaction.message);
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
    });

    await newOrder.save();

    console.log("Order pre-created:", orderNumber, "with reference:", transaction.data.reference);

    // Return authorization URL and order reference
    return NextResponse.json({
      success: true,
      authorizationUrl: transaction.data.authorization_url,
      reference: transaction.data.reference,
      orderNumber,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}