import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";
import { validateInput, paymentVerifySchema } from "@/lib/validation";

// Initialize Paystack with secret key
const paystack = PaystackLib(process.env.PAYSTACK_SECRET_KEY!);

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
    const validation = validateInput(paymentVerifySchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { reference, orderNumber } = validation.data!;

    console.log(`[Payment Verify] Verifying payment: ${reference} for order: ${orderNumber}`);

    // Connect to database
    await connectDB();

    // Check if order already exists and is paid (idempotency)
    if (orderNumber) {
      const existingOrder = await Order.findOne({ orderNumber });
      if (existingOrder && existingOrder.paymentStatus === "paid") {
        console.log(`[Payment Verify] Order already verified: ${orderNumber}`);
        return NextResponse.json({
          success: true,
          order: existingOrder,
          message: "Order already verified",
        });
      }
    }

    // Verify the transaction with Paystack
    const transaction = await paystack.transaction.verify(reference);

    if (!transaction.status) {
      console.error(`[Payment Verify] Paystack verification failed: ${transaction.message}`);

      // Update order status to failed if exists
      if (orderNumber) {
        await Order.findOneAndUpdate(
          { orderNumber },
          {
            paymentStatus: "failed",
            orderStatus: "Cancelled",
          }
        );
      }

      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paymentData = transaction.data;

    // Check payment status
    if (paymentData.status !== "success") {
      console.error(`[Payment Verify] Payment not successful: ${paymentData.status}`);

      // Update order status
      if (orderNumber) {
        await Order.findOneAndUpdate(
          { orderNumber },
          {
            paymentStatus: paymentData.status === "abandoned" ? "cancelled" : "failed",
            orderStatus: "Cancelled",
          }
        );
      }

      return NextResponse.json(
        {
          message: paymentData.status === "abandoned"
            ? "Payment was cancelled"
            : "Payment was not successful",
        },
        { status: 400 }
      );
    }

    // Payment successful - update order to paid status
    if (orderNumber) {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderNumber },
        {
          paymentStatus: "paid",
          orderStatus: "Paid",
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.error(`[Payment Verify] Order not found: ${orderNumber}`);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      console.log(`[Payment Verify] Order verified and updated: ${orderNumber} to paid status`);

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: "Payment verified successfully",
      });
    } else {
      // If no order number provided, try to find by reference
      const orderByRef = await Order.findOneAndUpdate(
        { paymentReference: reference },
        {
          paymentStatus: "paid",
          orderStatus: "Paid",
        },
        { new: true }
      );

      if (!orderByRef) {
        console.error(`[Payment Verify] Order not found for reference: ${reference}`);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      console.log(`[Payment Verify] Order verified by reference: ${reference} to paid status`);

      return NextResponse.json({
        success: true,
        order: orderByRef,
        message: "Payment verified successfully",
      });
    }
  } catch (error) {
    console.error("[Payment Verify] Error:", error);
    return NextResponse.json(
      { message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}