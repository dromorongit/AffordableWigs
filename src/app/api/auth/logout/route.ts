import { NextResponse } from "next/server";
import { removeCustomerCookie } from "@/lib/customerAuth";

export async function POST() {
  try {
    // Remove the customer cookie
    await removeCustomerCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[Logout] Error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}