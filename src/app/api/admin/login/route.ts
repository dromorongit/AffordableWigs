import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";
import { validateInput, adminLoginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.LOGIN);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        }
      }
    );
  }

  try {
    const validation = await request.json().then(data => validateInput(adminLoginSchema, data));
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;

    // Connect to database
    await dbConnect();

    // Find admin by email (include password for comparison)
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if password is correct
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(admin);

    // Set cookie
    await setAuthCookie(token);

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}