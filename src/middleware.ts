import { NextRequest, NextResponse } from "next/server";

// Cache for maintenance mode setting to avoid DB queries on every request
let maintenanceModeCache: { value: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch maintenance mode from internal API with caching
 */
async function getMaintenanceMode(request: NextRequest): Promise<boolean> {
  const now = Date.now();

  // Return cached value if still valid
  if (maintenanceModeCache && (now - maintenanceModeCache.timestamp) < CACHE_DURATION) {
    return maintenanceModeCache.value;
  }

  try {
    const port = process.env.PORT || 3000;
    const internalBaseUrl = `http://localhost:${port}`;
    const response = await fetch(`${internalBaseUrl}/api/admin/settings`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data = await response.json();
    const value = Boolean(data.maintenanceMode);

    // Update cache
    maintenanceModeCache = { value, timestamp: now };
    return value;
  } catch (error) {
    console.error("Failed to fetch maintenance mode:", error);
    return false; // Keep site accessible on error
  }
}

/**
 * Determine if a path should be excluded from maintenance check
 */
function shouldExcludePath(pathname: string): boolean {
  // Static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/static/")
  ) {
    return true;
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    return true;
  }

  // Admin panel and auth
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/account/login") ||
    pathname.startsWith("/account/register")
  ) {
    return true;
  }

  // Maintenance page itself
  if (pathname === "/maintenance" || pathname.startsWith("/maintenance/")) {
    return true;
  }

  // Essential public files (should remain accessible for SEO and app functionality)
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/_next/") // Already covered above but explicit
  ) {
    return true;
  }

  // Webhook endpoints (if any)
  if (pathname.startsWith("/api/webhook")) {
    return true;
  }

  return false;
}

/**
 * Main middleware - runs on every request (except excluded paths)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Running for: ${pathname}`);

  // Quick exclusion check
  if (shouldExcludePath(pathname)) {
    console.log(`[Middleware] Path ${pathname} excluded, skipping maintenance check`);
    return NextResponse.next();
  }

  // Check maintenance mode
  const isMaintenance = await getMaintenanceMode(request);
  console.log(`[Middleware] Maintenance mode is ${isMaintenance ? 'ENABLED' : 'disabled'}`);

  if (isMaintenance) {
    // Redirect to maintenance page with status 302 (temporary)
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    // Preserve the original URL as a query param for potential "back to site" logic
    url.searchParams.set("from", request.nextUrl.pathname);
    console.log(`[Middleware] Redirecting ${pathname} -> /maintenance`);
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

// Use Node.js runtime to allow mongoose (DB) usage
// Edge runtime prohibits dynamic code evaluation used by mongoose
export const runtime = "nodejs";

export const config = {
  // Match all routes; exclusions are handled inside middleware()
  matcher: "/:path*",
};
