import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentCustomer } from "@/lib/customerAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current customer from cookie
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    // Connect to database
    await connectDB();

    // Fetch the specific order and verify ownership
    const order = await Order.findOne({
      _id: orderId,
      userId: customerPayload.id,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paymentReference: order.paymentReference,
        items: order.items,
        customer: order.customer,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("[Get Order] Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the order" },
      { status: 500 }
    );
  }
}