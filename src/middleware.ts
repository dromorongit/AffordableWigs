import { NextRequest, NextResponse } from "next/server";

// This function can be marked as async if you're using await inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude API routes, admin panel, and maintenance page itself
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  try {
    // Fetch the maintenance mode setting from our API
    const response = await fetch(`${request.nextUrl.origin}/api/admin/settings`, {
      // Use internal request to avoid external network call
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If we can't fetch the setting, assume maintenance mode is off
      return NextResponse.next();
    }

    const data = await response.json();
    const maintenanceMode = data.maintenanceMode ?? false;

    if (maintenanceMode) {
      // Redirect to maintenance page
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Middleware error checking maintenance mode:", error);
    // If there's an error, we don't block the request
    return NextResponse.next();
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin panel)
     * - maintenance (maintenance page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|admin|maintenance).*)",
  ],
};