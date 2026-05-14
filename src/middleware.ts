import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

// Explicitly declare Node.js runtime for this middleware
// This prevents Edge Runtime validation errors when using Node.js modules like mongoose
export const runtime = "nodejs";

// Cache for maintenance mode setting to avoid DB queries on every request
let maintenanceModeCache: { value: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds cache

/**
 * Fetch maintenance mode from database with caching
 */
async function getMaintenanceMode(): Promise<boolean> {
  const now = Date.now();

  // Return cached value if still valid
  if (maintenanceModeCache && (now - maintenanceModeCache.timestamp) < CACHE_DURATION) {
    return maintenanceModeCache.value;
  }

  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "maintenanceMode" });
    const value = doc ? Boolean(doc.value) : false;

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

  // Quick exclusion check
  if (shouldExcludePath(pathname)) {
    return NextResponse.next();
  }

  // Check maintenance mode
  const isMaintenance = await getMaintenanceMode();

  if (isMaintenance) {
    // Redirect to maintenance page with status 302 (temporary)
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    // Preserve the original URL as a query param for potential "back to site" logic
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

/**
 * Matcher configuration - apply middleware to all paths
 * We do filtering inside middleware for better control and debugging
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/* (API routes)
     * - /_next/* (Next.js internals)
     * - /images/* (static images)
     * - /favicon.ico
     * - /admin/* (admin panel)
     * - /maintenance/* (maintenance page)
     * - /account/login, /account/register (auth pages)
     * - /robots.txt, /sitemap.xml, /manifest.json (essential static files)
     *
     * We do additional filtering inside middleware for safety.
     */
    "/((?!api|_next|admin|maintenance|images|favicon.ico|account/login|account/register|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};