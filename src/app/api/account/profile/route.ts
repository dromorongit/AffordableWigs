import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { validateInput, profileUpdateSchema } from "@/lib/validation";
import { getCurrentCustomer } from "@/lib/customerAuth";

export async function GET() {
  try {
    // Get current customer from cookie
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database and fetch user profile
    await connectDB();
    const user = await User.findById(customerPayload.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[Get Profile] Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get current customer from cookie
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(profileUpdateSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Update user profile
    const updateData: Record<string, unknown> = {};
    
    if (validation.data?.name) {
      updateData.name = validation.data.name;
    }
    if (validation.data?.phone !== undefined) {
      updateData.phone = validation.data.phone;
    }
    if (validation.data?.addresses) {
      updateData.addresses = validation.data.addresses;
    }

    const user = await User.findByIdAndUpdate(
      customerPayload.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("[Update Profile] Error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating profile" },
      { status: 500 }
    );
  }
}