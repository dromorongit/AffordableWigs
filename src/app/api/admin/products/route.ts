import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentAdmin } from "@/lib/auth";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";
import { validateInput, productSchema } from "@/lib/validation";

// GET - List all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const active = searchParams.get("active");

    const query: any = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by active status
    if (active !== null && active !== "") {
      query.isActive = active === "true";
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.ADMIN_API);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        }
      }
    );
  }

  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Validate input
    const validation = validateInput(productSchema, data);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = validation.data!.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      ...validation.data,
      slug,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}