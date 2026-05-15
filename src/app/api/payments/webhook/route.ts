import { NextRequest, NextResponse } from "next/server";
import PaystackLib from "paystack";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

const paystack = PaystackLib(process.env.PAYSTACK_SECRET_KEY!);

/**
 * Paystack Webhook Handler
 *
 * Paystack sends webhook events for every transaction — including charge.success.
 * This route is the ultimate safety net: even if the customer redirect fails
 * (the primary bug), this webhook will still fire and finalize the order.
 *
 * IMPORTANT: You must register this webhook URL in your Paystack dashboard:
 *   https://dashboard.paystack.co/#/settings/developer
 *   Webhook URL: https://affordablewigs-production.up.railway.app/api/payments/webhook
 *
 * Paystack signs every webhook request with an `x-paystack-signature` header.
 * We verify the signature before trusting the payload to prevent spoofing.
 */
export async function POST(request: NextRequest) {
  console.log("[Webhook DEBUG] Webhook route hit");

  // ── Verify Paystack signature ──────────────────────────────────────
  const paystackSignature = request.headers.get("x-paystack-signature");
  if (!paystackSignature) {
    console.error("[Webhook DEBUG] Missing x-paystack-signature header — rejecting");
    return NextResponse.json(
      { message: "Missing signature" },
      { status: 401 }
    );
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";

  // Compute HMAC-SHA512 of the raw body using the secret key
  const crypto = await import("crypto");
  const computedSignature = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (computedSignature !== paystackSignature) {
    console.error("[Webhook DEBUG] Signature mismatch — rejecting");
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 401 }
    );
  }

  console.log("[Webhook DEBUG] Signature verified");

  // Parse the event payload
  let event: { event: string; data: { reference: string; status: string; [key: string]: unknown } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error("[Webhook DEBUG] Failed to parse webhook body");
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  console.log("[Webhook DEBUG] Event type:", event.event);

  // We only care about charge.success events
  if (event.event !== "charge.success") {
    console.log("[Webhook DEBUG] Ignoring event type:", event.event);
    return NextResponse.json({ received: true });
  }

  const { reference, status: paystackStatus } = event.data;
  console.log("[Webhook DEBUG] charge.success — reference:", reference, "status:", paystackStatus);

  if (paystackStatus !== "success") {
    console.log("[Webhook DEBUG] charge.success but payment status is not 'success':", paystackStatus);
    return NextResponse.json({ received: true });
  }

  try {
    await connectDB();
    console.log("[Webhook DEBUG] Database connected");

    // ── Find the order by payment reference ──────────────────────────
    let order = await Order.findOne({ paymentReference: reference });
    if (!order) {
      console.warn("[Webhook DEBUG] No order found for reference:", reference, "— trying reference without timestamp suffix");
      // The reference stored in the DB might differ slightly from the webhook reference
      // Try a prefix match
      order = await Order.findOne({ paymentReference: { $regex: `^${reference.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` } });
    }

    if (!order) {
      console.error("[Webhook DEBUG] Order not found for reference:", reference, "— cannot finalize");
      // Still return 200 so Paystack doesn't retry endlessly
      return NextResponse.json({ received: true, message: "Order not found" });
    }

    console.log("[Webhook DEBUG] Order found:", order.orderNumber, "paymentStatus:", order.paymentStatus, "stockDeducted:", order.stockDeducted);

    // ── Idempotency guard: already fully processed ───────────────────
    if (order.paymentStatus === "paid" && order.stockDeducted === true) {
      console.log("[Webhook DEBUG] Order already fully processed — skipping");
      return NextResponse.json({ received: true, message: "Already processed" });
    }

    // ── Update payment status ─────────────────────────────────────────
    await Order.findOneAndUpdate(
      { _id: order._id },
      { paymentStatus: "paid", orderStatus: "Paid" }
    );
    console.log("[Webhook DEBUG] Order paymentStatus updated to 'paid'");

    // ── Deduct stock if not already deducted ─────────────────────────
    if (order.stockDeducted === false) {
      console.log("[Webhook DEBUG] Deducting stock for order:", order.orderNumber);
      const stockErrors: string[] = [];

      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error("[Webhook DEBUG] Product not found:", item.productId);
          stockErrors.push(`${item.name} (product not found)`);
          continue;
        }

        if (product.stockQuantity < item.quantity) {
          console.error(
            "[Webhook DEBUG] Insufficient stock for",
            item.name,
            "available:",
            product.stockQuantity,
            "required:",
            item.quantity
          );
          stockErrors.push(`${item.name} (available: ${product.stockQuantity}, required: ${item.quantity})`);
          continue;
        }

        product.stockQuantity -= item.quantity;
        await product.save();
        console.log(
          "[Webhook DEBUG] Stock deducted:",
          item.name,
          "qty=",
          item.quantity,
          "→ new stock:",
          product.stockQuantity
        );
      }

      if (stockErrors.length > 0) {
        console.error("[Webhook DEBUG] Stock deduction errors:", stockErrors);
        await Order.findOneAndUpdate(
          { _id: order._id },
          { stockDeducted: false }
        );
        return NextResponse.json(
          {
            received: true,
            success: false,
            message: `Payment verified but stock deduction failed: ${stockErrors.join(", ")}`,
          },
          { status: 200 } // Return 200 so Paystack doesn't retry
        );
      }

      await Order.findOneAndUpdate({ _id: order._id }, { stockDeducted: true });
      console.log("[Webhook DEBUG] Stock deduction complete for:", order.orderNumber);
    } else {
      console.log("[Webhook DEBUG] Stock already deducted — skipping");
    }

    // ── Final confirmation ────────────────────────────────────────────
    const updatedOrder = await Order.findById(order._id);
    console.log(
      "[Webhook DEBUG] Order finalized:",
      updatedOrder?.orderNumber,
      "| paymentStatus=",
      updatedOrder?.paymentStatus,
      "| stockDeducted=",
      updatedOrder?.stockDeducted
    );

    return NextResponse.json({
      received: true,
      success: true,
      message: "Order finalized via webhook",
    });
  } catch (error) {
    console.error("[Webhook DEBUG] Error:", error);
    // Return 200 so Paystack doesn't retry endlessly on our internal errors
    return NextResponse.json({ received: true });
  }
}
