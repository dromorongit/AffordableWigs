import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://affordablewigsgh.com";

export async function GET() {
  const robotsTxt = `# Robots.txt for Affordable Wigs Ghana
# ${BASE_URL}

User-agent: *
Allow: /
Allow: /shop
Allow: /about
Allow: /services
Allow: /reviews
Allow: /contact
Allow: /cart
Allow: /checkout

# Disallow admin and API routes
Disallow: /admin
Disallow: /api
Disallow: /admin/

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay (optional, for polite crawling)
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}