import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
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

    console.log(`[Payment Verify] Verifying payment: ${reference} for order: ${orderNumber || "N/A"}`);

    // Connect to database
    await connectDB();

    // ── Idempotency Guard ──
    // If order is fully processed (paid + stock deducted), return immediately.
    // This prevents duplicate stock deduction on repeated /success page loads or
    // duplicate webhook calls.
    if (orderNumber) {
      const existingOrder = await Order.findOne({ orderNumber });
      if (existingOrder) {
        console.log(
          `[Payment Verify] Order found: ${orderNumber}, paymentStatus=${existingOrder.paymentStatus}, stockDeducted=${existingOrder.stockDeducted}`
        );

        // Fully processed — nothing more to do
        if (existingOrder.paymentStatus === "paid" && existingOrder.stockDeducted === true) {
          console.log(`[Payment Verify] Order already fully processed (paid + stock deducted): ${orderNumber}`);
          return NextResponse.json({
            success: true,
            order: existingOrder,
            message: "Order already verified",
          });
        }

        // Paid but stock not yet deducted — recover by deducting stock now
        if (existingOrder.paymentStatus === "paid" && existingOrder.stockDeducted === false) {
          console.log(`[Payment Verify] Recovery: order is paid but stock not yet deducted for: ${orderNumber}`);
          const stockErrors: string[] = [];
          for (const item of existingOrder.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
              console.error(`[Payment Verify] Product not found during stock recovery: ${item.productId}`);
              stockErrors.push(item.name);
              continue;
            }
            if (product.stockQuantity < item.quantity) {
              console.error(
                `[Payment Verify] Insufficient stock during recovery for ${item.name}: ` +
                `available=${product.stockQuantity}, required=${item.quantity}`
              );
              stockErrors.push(`${item.name} (available: ${product.stockQuantity}, required: ${item.quantity})`);
              continue;
            }
            product.stockQuantity -= item.quantity;
            await product.save();
            console.log(
              `[Payment Verify] Stock deducted (recovery): ${item.name} -${item.quantity} → new stock: ${product.stockQuantity}`
            );
          }

          if (stockErrors.length > 0) {
            console.error(`[Payment Verify] Stock recovery errors:`, stockErrors);
            return NextResponse.json(
              {
                success: false,
                message: `Payment verified but stock deduction had errors: ${stockErrors.join(", ")}. Please contact support.`,
              },
              { status: 500 }
            );
          }

          await Order.findOneAndUpdate(
            { orderNumber },
            { stockDeducted: true }
          );
          console.log(`[Payment Verify] Stock recovery complete for: ${orderNumber}`);
          return NextResponse.json({
            success: true,
            order: existingOrder,
            message: "Order verified and stock deducted (recovery)",
          });
        }
      }
    }

    // Verify the transaction with Paystack
    console.log(`[Payment Verify] Calling Paystack verify for reference: ${reference}`);
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

    // ── Payment Successful ──
    console.log(`[Payment Verify] Payment SUCCESS for reference: ${reference}`);

    // Find the order to get items for stock deduction
    let orderForStockDeduction = null;
    if (orderNumber) {
      orderForStockDeduction = await Order.findOne({ orderNumber });
    }
    // Fallback: find by payment reference
    if (!orderForStockDeduction) {
      orderForStockDeduction = await Order.findOne({ paymentReference: reference });
    }

    if (!orderForStockDeduction) {
      console.error(`[Payment Verify] Order not found for reference: ${reference}, orderNumber: ${orderNumber}`);
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // ── Stock Deduction ──
    // Only deduct if not already deducted (idempotency guard)
    if (orderForStockDeduction.stockDeducted === false) {
      console.log(
        `[Payment Verify] Deducting stock for order: ${orderForStockDeduction.orderNumber}, ` +
        `items: ${orderForStockDeduction.items.length}`
      );
      const stockErrors: string[] = [];

      for (const item of orderForStockDeduction.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(`[Payment Verify] Product not found: ${item.productId} (${item.name})`);
          stockErrors.push(`${item.name} (product not found)`);
          continue;
        }

        if (product.stockQuantity < item.quantity) {
          // This should not happen if pre-checkout validation worked, but handle gracefully
          console.error(
            `[Payment Verify] CRITICAL: Insufficient stock for ${item.name}: ` +
            `available=${product.stockQuantity}, required=${item.quantity}`
          );
          stockErrors.push(
            `${item.name} (available: ${product.stockQuantity}, required: ${item.quantity})`
          );
          continue;
        }

        // Deduct stock
        product.stockQuantity -= item.quantity;
        await product.save();
        console.log(
          `[Payment Verify] Stock deducted: ${item.name} qty=${item.quantity} → new stock: ${product.stockQuantity}`
        );
      }

      if (stockErrors.length > 0) {
        console.error(`[Payment Verify] Stock deduction errors:`, stockErrors);
        // Payment is verified but stock deduction failed — flag the order for manual review
        await Order.findOneAndUpdate(
          { _id: orderForStockDeduction._id },
          {
            paymentStatus: "paid",
            orderStatus: "Paid",
            stockDeducted: false,
          }
        );
        return NextResponse.json(
          {
            success: false,
            message: `Payment verified but stock deduction failed for: ${stockErrors.join(", ")}. Please contact support.`,
          },
          { status: 500 }
        );
      }

      // Mark stock as deducted
      await Order.findOneAndUpdate(
        { _id: orderForStockDeduction._id },
        { stockDeducted: true }
      );
      console.log(`[Payment Verify] Stock deduction complete for order: ${orderForStockDeduction.orderNumber}`);
    } else {
      console.log(`[Payment Verify] Stock already deducted for order: ${orderForStockDeduction.orderNumber} — skipping`);
    }

    // ── Update Order Status ──
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderForStockDeduction._id },
      {
        paymentStatus: "paid",
        orderStatus: "Paid",
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.error(`[Payment Verify] Order not found after update: ${orderForStockDeduction.orderNumber}`);
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log(
      `[Payment Verify] Order finalized: ${updatedOrder.orderNumber} | ` +
      `paymentStatus=${updatedOrder.paymentStatus} | orderStatus=${updatedOrder.orderStatus} | ` +
      `stockDeducted=${updatedOrder.stockDeducted}`
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("[Payment Verify] Error:", error);
    return NextResponse.json(
      { message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
