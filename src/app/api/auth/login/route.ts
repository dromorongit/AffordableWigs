import { NextRequest, NextResponse } from "next/server";
import { validateInput, loginSchema } from "@/lib/validation";
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
    const validation = validateInput(loginSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.errors?.join(", ") || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;

    console.log("[Login] Attempting login for:", email);

    // Demo mode authentication (when MongoDB is not available)
    if (DEMO_MODE) {
      console.log("[Login] Running in demo mode (no MongoDB)");
      
      const demoUser = DEMO_USERS[email.toLowerCase()];
      if (demoUser && demoUser.password === password) {
        // Create a mock user payload for demo
        const mockPayload: CustomerPayload = {
          id: "demo-" + Date.now(),
          email: email.toLowerCase(),
          name: demoUser.name,
        };
        
        // Generate JWT token
        const token = generateCustomerToken(mockPayload as any);
        
        // Set httpOnly cookie
        await setCustomerCookie(token);
        
        return NextResponse.json({
          success: true,
          message: "Login successful (demo mode)",
          user: {
            id: mockPayload.id,
            email: mockPayload.email,
            name: mockPayload.name,
          },
        });
      }
      
      // Check if MongoDB is available, if not deny login for non-demo users
      if (!process.env.MONGODB_URI) {
        return NextResponse.json(
          { message: "Demo mode: Use demo@affordablewigsgh.com / demo1234" },
          { status: 401 }
        );
      }
    }

    // Real database authentication
    const { connectDB } = await import("@/lib/mongodb");
    const User = (await import("@/models/User")).default;
    
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