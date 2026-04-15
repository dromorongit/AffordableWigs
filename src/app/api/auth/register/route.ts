import { NextRequest, NextResponse } from "next/server";
import { validateInput, registerSchema } from "@/lib/validation";
import { generateCustomerToken, setCustomerCookie, CustomerPayload } from "@/lib/customerAuth";
import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rateLimit";

// Demo mode flag - set to true to enable demo credentials without MongoDB
const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.MONGODB_URI;

// Demo users that work without MongoDB
const DEMO_USERS: Record<string, { password: string; name: string }> = {
  "demo@affordablewigsgh.com": { password: "demo1234", name: "Demo Customer" },
  "test@test.com": { password: "test1234", name: "Test User" },
};

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

    // Demo mode - check if trying to register a demo user
    if (DEMO_MODE) {
      console.log("[Register] Running in demo mode (no MongoDB)");
      
      // Check if the email matches an existing demo user
      const existingDemo = DEMO_USERS[email.toLowerCase()];
      if (existingDemo) {
        return NextResponse.json(
          { message: "An account with this email already exists" },
          { status: 409 }
        );
      }
      
      // Without MongoDB, we can't create new users
      // Provide a helpful message
      if (!process.env.MONGODB_URI) {
        return NextResponse.json(
          { 
            message: "Registration is not available in demo mode. Please use the demo credentials: demo@affordablewigsgh.com / demo1234",
            demoMode: true,
            demoCredentials: {
              email: "demo@affordablewigsgh.com",
              password: "demo1234"
            }
          },
          { status: 403 }
        );
      }
    }

    // Real database registration
    const { connectDB } = await import("@/lib/mongodb");
    const User = (await import("@/models/User")).default;
    
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