import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentCustomer } from "@/lib/customerAuth";

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

    // Connect to database
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