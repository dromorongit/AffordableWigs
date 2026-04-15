import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentCustomer } from "@/lib/customerAuth";

export async function GET() {
  try {
    // Get current customer from cookie
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Connect to database and verify user exists
    await connectDB();
    const user = await User.findById(customerPayload.id);

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("[Auth Me] Error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}