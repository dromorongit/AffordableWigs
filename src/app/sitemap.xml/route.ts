import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://affordablewigsgh.com";

// Ensure BASE_URL has a valid protocol for URL constructor
const getValidBaseUrl = (url: string): string => {
  if (!url) return "https://affordablewigsgh.com";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

const validBaseUrl = getValidBaseUrl(BASE_URL);

export async function GET() {
  try {
    await connectDB();

    // Fetch active products and categories
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select("slug updatedAt").lean(),
      Category.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    const staticPages = [
      "",
      "/about",
      "/shop",
      "/services",
      "/reviews",
      "/contact",
      "/cart",
      "/checkout",
    ];

    const sitemapEntries = [
      // Static pages
      ...staticPages.map((path) => ({
        url: `${validBaseUrl}${path}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1.0 : 0.8,
      })),
      // Categories
      ...categories.map((cat) => ({
        url: `${validBaseUrl}/shop?category=${cat.slug}`,
        lastModified: cat.updatedAt?.toISOString() || new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      // Products
      ...products.map((product) => ({
        url: `${validBaseUrl}/shop/${product.slug}`,
        lastModified: product.updatedAt?.toISOString() || new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}