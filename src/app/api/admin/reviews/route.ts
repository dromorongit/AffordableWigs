import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { getCurrentAdmin } from "@/lib/auth";

// GET - List all reviews
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const visible = searchParams.get("visible");

    const query: any = {};

    if (visible !== null && visible !== "") {
      query.isVisible = visible === "true";
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.customerName || !data.message || !data.rating) {
      return NextResponse.json(
        { error: "Customer name, message, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create(data);

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}