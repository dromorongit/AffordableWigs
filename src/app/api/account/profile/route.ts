import { NextRequest, NextResponse } from "next/server";
import { validateInput, profileUpdateSchema } from "@/lib/validation";
import { getCurrentCustomer } from "@/lib/customerAuth";

// Demo mode flag
const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.MONGODB_URI;

// Demo user data
const DEMO_USER = {
  id: "demo-user-1",
  email: "demo@affordablewigsgh.com",
  name: "Demo Customer",
  phone: "+233 123 456 789",
  addresses: [],
  createdAt: new Date().toISOString(),
};

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

    // Demo mode - return mock user data
    if (DEMO_MODE) {
      console.log("[Get Profile] Demo mode - returning mock profile");
      
      return NextResponse.json({
        success: true,
        user: {
          ...DEMO_USER,
          id: customerPayload.id,
          email: customerPayload.email,
          name: customerPayload.name,
        },
      });
    }

    // Real database query
    const { connectDB } = await import("@/lib/mongodb");
    const User = (await import("@/models/User")).default;
    
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

    // Demo mode - return success without saving
    if (DEMO_MODE) {
      console.log("[Update Profile] Demo mode - simulating update");
      
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully (demo mode)",
        user: {
          id: customerPayload.id,
          email: customerPayload.email,
          name: validation.data?.name || customerPayload.name,
          phone: validation.data?.phone,
        },
      });
    }

    // Real database update
    const { connectDB } = await import("@/lib/mongodb");
    const User = (await import("@/models/User")).default;
    
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