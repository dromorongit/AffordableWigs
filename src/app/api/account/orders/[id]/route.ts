import { NextRequest, NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customerAuth";

// Demo mode flag
const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.MONGODB_URI;

// Demo orders for demo users
const DEMO_ORDERS: Record<string, any> = {
  "demo-order-1": {
    _id: "demo-order-1",
    orderNumber: "AWG-DEMO-001",
    total: 450,
    subtotal: 450,
    currency: "GHS",
    paymentStatus: "paid",
    orderStatus: "Delivered",
    paymentReference: "DEMO-REF-001",
    items: [
      { productId: "p1", name: "Premium Lace Front Wig", slug: "premium-lace-front-wig", price: 350, quantity: 1, mainImage: null },
    ],
    customer: {
      fullName: "Demo Customer",
      phone: "+233 123 456 789",
      email: "demo@affordablewigsgh.com",
      deliveryAddress: "123 Demo Street, Accra",
      cityOrTown: "Accra",
      regionOrArea: "Greater Accra",
      orderNotes: "",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "demo-order-2": {
    _id: "demo-order-2",
    orderNumber: "AWG-DEMO-002",
    total: 280,
    subtotal: 280,
    currency: "GHS",
    paymentStatus: "paid",
    orderStatus: "Shipped",
    paymentReference: "DEMO-REF-002",
    items: [
      { productId: "p2", name: "Bob Cut Wig", slug: "bob-cut-wig", price: 180, quantity: 1, mainImage: null },
      { productId: "p3", name: "Wig Cap", slug: "wig-cap", price: 50, quantity: 2, mainImage: null },
    ],
    customer: {
      fullName: "Demo Customer",
      phone: "+233 123 456 789",
      email: "demo@affordablewigsgh.com",
      deliveryAddress: "123 Demo Street, Accra",
      cityOrTown: "Accra",
      regionOrArea: "Greater Accra",
      orderNotes: "Please ring doorbell",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

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

    // Demo mode - return mock order
    if (DEMO_MODE) {
      console.log("[Get Order] Demo mode - returning mock order");
      
      const order = DEMO_ORDERS[orderId];
      if (order) {
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
      }
      
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Real database query
    const { connectDB } = await import("@/lib/mongodb");
    const Order = (await import("@/models/Order")).default;
    
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