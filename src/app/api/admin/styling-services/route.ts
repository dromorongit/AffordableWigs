import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StylingService from "@/models/StylingService";
import { getCurrentAdmin } from "@/lib/auth";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (active !== null && active !== "") {
      query.isActive = active === "true";
    }

    const [services, total] = await Promise.all([
      StylingService.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StylingService.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching styling services:", error);
    return NextResponse.json(
      { error: "Failed to fetch styling services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    if (!body.name || !body.slug || !body.description || body.price === undefined || body.price === null) {
      return NextResponse.json(
        { error: "Name, slug, description, and price are required" },
        { status: 400 }
      );
    }

    const slug = body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");

    const existing = await StylingService.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A styling service with this slug already exists" },
        { status: 400 }
      );
    }

    const service = await StylingService.create({
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      price: Number(body.price),
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: Number(body.sortOrder) || 0,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating styling service:", error);

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
      { error: "Failed to create styling service" },
      { status: 500 }
    );
  }
}
