import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { validateInput, loginSchema } from "@/lib/validation";
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
    const validation = validateInput(loginSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;

    console.log("[Login] Attempting login for:", email);

    // Connect to database
    await connectDB();

    // Find user with password (since password is not included by default)
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("[Login] Login successful for:", user._id);

    // Generate JWT token
    const token = generateCustomerToken(user);

    // Set httpOnly cookie
    await setCustomerCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { message: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}