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
  
  console.log("[Verify DEBUG] Route hit");
  console.log("[Verify DEBUG] Client IP:", clientIP);
  console.log("[Verify DEBUG] Rate limit allowed:", rateLimitResult.allowed);

  if (!rateLimitResult.allowed) {
    console.log("[Verify DEBUG] Rate limit exceeded");
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
        console.log("[Verify DEBUG] Validation failed:", validation.errors);
        return NextResponse.json(
          { message: validation.errors?.join(", ") || "Invalid input" },
          { status: 400 }
        );
      }

      const { reference, orderNumber } = validation.data!;

      console.log(`[Verify DEBUG] Route hit`);
      console.log(`[Verify DEBUG] Verifying payment: ${reference} for order: ${orderNumber || "N/A"}`);

    // Connect to database
    await connectDB();
    console.log("[Verify DEBUG] Database connected");

    // ── Idempotency Guard ──
    // If order is fully processed (paid + stock deducted), return immediately.
    // This prevents duplicate stock deduction on repeated /success page loads or
    // duplicate webhook calls.
    if (orderNumber) {
      console.log(`[Verify DEBUG] Looking up order by orderNumber: ${orderNumber}`);
      const existingOrder = await Order.findOne({ orderNumber });
      if (existingOrder) {
        console.log(
          `[Verify DEBUG] Order found: ${orderNumber}, paymentStatus=${existingOrder.paymentStatus}, stockDeducted=${existingOrder.stockDeducted}`
        );

        // Fully processed — nothing more to do
        if (existingOrder.paymentStatus === "paid" && existingOrder.stockDeducted === true) {
          console.log(`[Verify DEBUG] Order already fully processed (paid + stock deducted): ${orderNumber}`);
          return NextResponse.json({
            success: true,
            order: existingOrder,
            message: "Order already verified",
          });
        }

        // Paid but stock not yet deducted — recover by deducting stock now
        if (existingOrder.paymentStatus === "paid" && existingOrder.stockDeducted === false) {
          console.log(`[Verify DEBUG] Recovery: order is paid but stock not yet deducted for: ${orderNumber}`);
          const stockErrors: string[] = [];
          for (const item of existingOrder.items) {
            console.log(`[Verify DEBUG] Checking product for item: ${item.productId}`);
            const product = await Product.findById(item.productId);
            if (!product) {
              console.error(`[Verify DEBUG] Product not found during stock recovery: ${item.productId}`);
              stockErrors.push(item.name);
              continue;
            }
            console.log(`[Verify DEBUG] Product found: ${product.name}, stock: ${product.stockQuantity}, needed: ${item.quantity}`);
            if (product.stockQuantity < item.quantity) {
              console.error(
                `[Verify DEBUG] Insufficient stock during recovery for ${item.name}: ` +
                `available=${product.stockQuantity}, required=${item.quantity}`
              );
              stockErrors.push(`${item.name} (available: ${product.stockQuantity}, required: ${item.quantity})`);
              continue;
            }
            product.stockQuantity -= item.quantity;
            await product.save();
            console.log(
              `[Verify DEBUG] Stock deducted (recovery): ${item.name} -${item.quantity} → new stock: ${product.stockQuantity}`
            );
          }

          if (stockErrors.length > 0) {
            console.error(`[Verify DEBUG] Stock recovery errors:`, stockErrors);
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
          console.log(`[Verify DEBUG] Stock recovery complete for: ${orderNumber}`);
          return NextResponse.json({
            success: true,
            order: existingOrder,
            message: "Order verified and stock deducted (recovery)",
          });
        }
      } else {
        console.log(`[Verify DEBUG] No order found with orderNumber: ${orderNumber}`);
      }
    }

    // Verify the transaction with Paystack
    console.log(`[Verify DEBUG] Calling Paystack verify for reference: ${reference}`);
    const transaction = await paystack.transaction.verify(reference);

    if (!transaction.status) {
      console.error(`[Verify DEBUG] Paystack verification failed: ${transaction.message}`);

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

    console.log(`[Verify DEBUG] Paystack verification successful for reference: ${reference}`);

    const paymentData = transaction.data;
    console.log(`[Verify DEBUG] Payment data received:`, paymentData);

    // Check payment status
    if (paymentData.status !== "success") {
      console.error(`[Verify DEBUG] Payment not successful: ${paymentData.status}`);

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

    console.log(`[Verify DEBUG] Payment SUCCESS for reference: ${reference}`);

    // ── Payment Successful ──
    console.log(`[Verify DEBUG] Payment SUCCESS for reference: ${reference}`);

    // Find the order to get items for stock deduction
    console.log(`[Verify DEBUG] Looking up order for stock deduction`);
    let orderForStockDeduction = null;
    if (orderNumber) {
      console.log(`[Verify DEBUG] Trying to find order by orderNumber: ${orderNumber}`);
      orderForStockDeduction = await Order.findOne({ orderNumber });
    }
    // Fallback: find by payment reference
    if (!orderForStockDeduction) {
      console.log(`[Verify DEBUG] Trying to find order by paymentReference: ${reference}`);
      orderForStockDeduction = await Order.findOne({ paymentReference: reference });
    }

    if (!orderForStockDeduction) {
      console.error(`[Verify DEBUG] Order not found for reference: ${reference}, orderNumber: ${orderNumber}`);
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log(`[Verify DEBUG] Order found for stock deduction: ${orderForStockDeduction.orderNumber}`);
    console.log(`[Verify DEBUG] Order items count: ${orderForStockDeduction.items.length}`);
    console.log(`[Verify DEBUG] Order stockDeducted flag: ${orderForStockDeduction.stockDeducted}`);

    // ── Stock Deduction ──
    // Only deduct if not already deducted (idempotency guard)
    console.log(`[Verify DEBUG] Checking stockDeducted flag: ${orderForStockDeduction.stockDeducted}`);
    if (orderForStockDeduction.stockDeducted === false) {
      console.log(
        `[Verify DEBUG] Deducting stock for order: ${orderForStockDeduction.orderNumber}, ` +
        `items: ${orderForStockDeduction.items.length}`
      );
      const stockErrors: string[] = [];

      for (const item of orderForStockDeduction.items) {
        console.log(`[Verify DEBUG] Processing item: ${item.productId} (${item.name}) qty: ${item.quantity}`);
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(`[Verify DEBUG] Product not found: ${item.productId} (${item.name})`);
          stockErrors.push(`${item.name} (product not found)`);
          continue;
        }
        console.log(`[Verify DEBUG] Product found: ${product.name}, current stock: ${product.stockQuantity}`);

        if (product.stockQuantity < item.quantity) {
          // This should not happen if pre-checkout validation worked, but handle gracefully
          console.error(
            `[Verify DEBUG] CRITICAL: Insufficient stock for ${item.name}: ` +
            `available=${product.stockQuantity}, required=${item.quantity}`
          );
          stockErrors.push(
            `${item.name} (available: ${product.stockQuantity}, required: ${item.quantity})`
          );
          continue;
        }

        // Deduct stock
        const oldStock = product.stockQuantity;
        product.stockQuantity -= item.quantity;
        await product.save();
        console.log(
          `[Verify DEBUG] Stock deducted: ${item.name} qty=${item.quantity} → new stock: ${product.stockQuantity} (was ${oldStock})`
        );
        
        // Verify the save worked
        const verifyProduct = await Product.findById(item.productId);
        if (verifyProduct) {
          console.log(`[Verify DEBUG] Verified stock after save: ${verifyProduct.stockQuantity}`);
        } else {
          console.error(`[Verify DEBUG] FAILED to verify product after save!`);
        }
      }

      if (stockErrors.length > 0) {
        console.error(`[Verify DEBUG] Stock deduction errors:`, stockErrors);
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
      console.log(`[Verify DEBUG] Marking order as stock deducted`);
      await Order.findOneAndUpdate(
        { _id: orderForStockDeduction._id },
        { stockDeducted: true }
      );
      console.log(`[Verify DEBUG] Stock deduction complete for order: ${orderForStockDeduction.orderNumber}`);
    } else {
      console.log(`[Verify DEBUG] Stock already deducted for order: ${orderForStockDeduction.orderNumber} — skipping`);
    }

    // ── Update Order Status ──
    console.log(`[Verify DEBUG] Updating order status to paid`);
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderForStockDeduction._id },
      {
        paymentStatus: "paid",
        orderStatus: "Paid",
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.error(`[Verify DEBUG] Order not found after update: ${orderForStockDeduction.orderNumber}`);
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log(
      `[Verify DEBUG] Order finalized: ${updatedOrder.orderNumber} | ` +
      `paymentStatus=${updatedOrder.paymentStatus} | orderStatus=${updatedOrder.orderStatus} | ` +
      `stockDeducted=${updatedOrder.stockDeducted}`
    );

    console.log(`[Verify DEBUG] Returning success response`);
    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("[Verify DEBUG] Error in verification:", error);
    return NextResponse.json(
      { message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
