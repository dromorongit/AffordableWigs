import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST() {
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

    // Create initial admin
    const admin = await Admin.create({
      email: "admin@affordablewigsgh.com",
      password: "admin123",
      name: "Admin",
    });

    return NextResponse.json(
      { 
        message: "Admin created successfully",
        admin: {
          email: admin.email,
          name: admin.name
        }
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