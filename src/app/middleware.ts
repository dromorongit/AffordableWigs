import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

// Cache for maintenance mode setting to avoid DB queries on every request
// TEMP: Disabled for debugging - set to 0 to bypass cache
let maintenanceModeCache: { value: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 0; // 0 = no cache, force DB read every request

/**
 * Fetch maintenance mode from database with caching
 */
async function getMaintenanceMode(): Promise<boolean> {
  const now = Date.now();

  // Return cached value if still valid
  if (maintenanceModeCache && (now - maintenanceModeCache.timestamp) < CACHE_DURATION) {
    console.log(`[Middleware] Using cached maintenance mode: ${maintenanceModeCache.value}`);
    return maintenanceModeCache.value;
  }

  try {
    console.log(`[Middleware] Fetching maintenance mode from DB...`);
    await connectDB();
    const doc = await Settings.findOne({ key: "maintenanceMode" });
    const value = doc ? Boolean(doc.value) : false;
    console.log(`[Middleware] DB query result - doc exists: ${!!doc}, raw value:`, doc ? doc.value : 'null', '=> boolean:', value);

    // Update cache
    maintenanceModeCache = { value, timestamp: now };
    return value;
  } catch (error) {
    console.error("Failed to fetch maintenance mode from DB:", error);
    // On DB error, default to false to keep site accessible
    return false;
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
  console.log(`[Middleware] Request for ${pathname} - Starting maintenance check`);

  // Quick exclusion check
  if (shouldExcludePath(pathname)) {
    console.log(`[Middleware] Path ${pathname} excluded, skipping maintenance check`);
    return NextResponse.next();
  }

  // Check maintenance mode
  const isMaintenance = await getMaintenanceMode();
  console.log(`[Middleware] Maintenance mode is ${isMaintenance ? 'ENABLED' : 'disabled'}`);

  if (isMaintenance) {
    // Redirect to maintenance page with status 302 (temporary)
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    // Preserve the original URL as a query param for potential "back to site" logic
    url.searchParams.set("from", request.nextUrl.pathname);
    console.log(`[Middleware] Redirecting to /maintenance`);
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 */
// Use Node.js runtime to allow mongoose (DB) usage
// Edge runtime prohibits dynamic code evaluation used by mongoose
export const runtime = "nodejs";

export const config = {
  // Match all routes; exclusions are handled inside middleware()
  matcher: "/:path*",
};