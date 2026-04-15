import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { validateInput, registerSchema } from "@/lib/validation";
import { generateCustomerToken, setCustomerCookie } from "@/lib/customerAuth";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.LOGIN);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        }
      }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(registerSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data!;

    console.log("[Register] Starting registration for:", email);

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      name,
    });

    await newUser.save();

    console.log("[Register] User created:", newUser._id);

    // Generate JWT token
    const token = generateCustomerToken(newUser);

    // Set httpOnly cookie
    await setCustomerCookie(token);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("[Register] Error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}