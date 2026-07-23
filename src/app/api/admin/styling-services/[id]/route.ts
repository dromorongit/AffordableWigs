import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StylingService from "@/models/StylingService";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const service = await StylingService.findById(params.id).lean();

    if (!service) {
      return NextResponse.json({ error: "Styling service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching styling service:", error);
    return NextResponse.json(
      { error: "Failed to fetch styling service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);

    if (body.slug !== undefined) {
      const slug = body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");
      const existing = await StylingService.findOne({ slug, _id: { $ne: params.id } });
      if (existing) {
        return NextResponse.json(
          { error: "A styling service with this slug already exists" },
          { status: 400 }
        );
      }
      updateData.slug = slug;
    }

    const service = await StylingService.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json({ error: "Styling service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error("Error updating styling service:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A styling service with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update styling service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const service = await StylingService.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json({ error: "Styling service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Styling service deleted successfully" });
  } catch (error) {
    console.error("Error deleting styling service:", error);
    return NextResponse.json(
      { error: "Failed to delete styling service" },
      { status: 500 }
    );
  }
}
