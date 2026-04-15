import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customerAuth";

// Demo mode flag
const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.MONGODB_URI;

// Demo orders for demo users
const DEMO_ORDERS = [
  {
    _id: "demo-order-1",
    orderNumber: "AWG-DEMO-001",
    total: 450,
    currency: "GHS",
    paymentStatus: "paid",
    orderStatus: "Delivered",
    items: [
      { name: "Premium Lace Front Wig", price: 350, quantity: 1 },
    ],
    customer: {
      fullName: "Demo Customer",
      email: "demo@affordablewigsgh.com",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "demo-order-2",
    orderNumber: "AWG-DEMO-002",
    total: 280,
    currency: "GHS",
    paymentStatus: "paid",
    orderStatus: "Shipped",
    items: [
      { name: "Bob Cut Wig", price: 180, quantity: 1 },
      { name: "Wig Cap", price: 50, quantity: 2 },
    ],
    customer: {
      fullName: "Demo Customer",
      email: "demo@affordablewigsgh.com",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // Get current customer from cookie
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Demo mode - return mock orders
    if (DEMO_MODE) {
      console.log("[Get Orders] Demo mode - returning mock orders");
      
      // Return demo orders for demo user, empty for others
      const isDemoUser = customerPayload.email.toLowerCase().includes("demo") || 
                        customerPayload.email.toLowerCase().includes("test");
      
      return NextResponse.json({
        success: true,
        orders: isDemoUser ? DEMO_ORDERS : [],
      });
    }

    // Real database query
    const { connectDB } = await import("@/lib/mongodb");
    const Order = (await import("@/models/Order")).default;
    
    await connectDB();

    // Fetch orders for this user, sorted by creation date (newest first)
    const orders = await Order.find({ userId: customerPayload.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        items: order.items,
        customer: order.customer,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
    });
  } catch (error) {
    console.error("[Get Orders] Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching orders" },
      { status: 500 }
    );
  }
}