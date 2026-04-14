import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const adminPayload = await getCurrentAdmin();

    if (!adminPayload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Connect to database and verify admin exists
    await dbConnect();
    const admin = await Admin.findById(adminPayload.id);

    if (!admin) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin check auth error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}