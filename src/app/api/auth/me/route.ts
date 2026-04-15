import { NextResponse } from "next/server";
import { getCurrentCustomer } from "/lib/customerAuth";

// Optional: import User for additional validation if DB is available
// import User from "@/models/User";
// import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    // Get current customer from cookie (JWT verification doesn't require DB)
    const customerPayload = await getCurrentCustomer();

    if (!customerPayload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // If we have a valid token but no DB, return minimal user info from token
    // This allows the app to work without MongoDB for demonstration
    return NextResponse.json({
      authenticated: true,
      user: {
        id: customerPayload.id,
        email: customerPayload.email,
        name: customerPayload.name,
      },
    });
    
    // Note: The code below would normally verify the user exists in DB
    // For demo purposes without MongoDB, we trust the valid JWT token
    /*
    try {
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
    } catch (dbError) {
      // If DB connection fails but token is valid, return token data
      console.warn("[Auth Me] DB unavailable, using token data:", dbError);
      return NextResponse.json({
        authenticated: true,
        user: {
          id: customerPayload.id,
          email: customerPayload.email,
          name: customerPayload.name,
        },
      });
    }
    */
  } catch (error) {
    console.error("[Auth Me] Error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}