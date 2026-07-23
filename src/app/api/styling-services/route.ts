import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StylingService from "@/models/StylingService";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const services = await StylingService.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const formatted = services.map((s) => ({
      _id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      description: s.description,
      price: s.price,
      sortOrder: s.sortOrder,
    }));

    const result = [
      { _id: "none", name: "No Styling", price: 0, description: "" },
      ...formatted,
    ];

    return NextResponse.json({ services: result });
  } catch (error) {
    console.error("Error fetching styling services:", error);
    return NextResponse.json(
      { error: "Failed to fetch styling services" },
      { status: 500 }
    );
  }
}
