import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

// Disable admin seed in production - use environment variable to enable if needed
const ADMIN_SEED_ENABLED = process.env.NODE_ENV !== "production" || process.env.ALLOW_ADMIN_SEED === "true";

export async function POST() {
  // Disable in production unless explicitly enabled via env var
  if (!ADMIN_SEED_ENABLED) {
    return NextResponse.json(
      { error: "Admin seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@affordablewigsgh.com" });
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 200 }
      );
    }

    // Create initial admin - password should be changed in production
    // Using a complex default password that should be changed
    const admin = await Admin.create({
      email: "admin@affordablewigsgh.com",
      password: "ChangeMe123!", // Default password - MUST be changed in production
      name: "Admin",
    });

    return NextResponse.json(
      { 
        message: "Admin created successfully",
        admin: {
          email: admin.email,
          name: admin.name
        },
        warning: "Please change the default password immediately!"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}