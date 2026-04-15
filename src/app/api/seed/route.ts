import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { Types } from "mongoose";

// Disable seed endpoint in production
const SEED_ENABLED = process.env.NODE_ENV !== "production" || process.env.ALLOW_SEED === "true";

// Category data
const categories = [
  { name: "Ready-to-Wear Wigs", slug: "ready-to-wear-wigs", description: "Pre-styled wigs ready to wear instantly", isActive: true, sortOrder: 1 },
  { name: "Wig Bundles", slug: "wig-bundles", description: "Premium hair bundles for custom styling", isActive: true, sortOrder: 2 },
  { name: "Closures", slug: "closures", description: "High-quality closures for a natural look", isActive: true, sortOrder: 3 },
  { name: "Frontals", slug: "frontals", description: "Premium frontals for flawless hairlines", isActive: true, sortOrder: 4 },
];

// Product data
const products = [
  { name: "Classic Body Wave Wig", slug: "classic-body-wave-wig", categoryName: "Ready-to-Wear Wigs", shortDescription: "Elegant body wave texture", description: "Premium body wave wig", price: 850, compareAtPrice: 1200, stockQuantity: 15, mainImage: "/images/products/classic-body-wave.jpg", images: ["/images/products/classic-body-wave.jpg"], isFeatured: true, isBestSeller: true, isNewArrival: false, isActive: true, tags: ["body wave"], texture: "Body Wave", length: "14 inches", capSize: "Medium", laceType: "Swiss Lace" },
  { name: "Silky Straight Luxury Unit", slug: "silky-straight-luxury-unit", categoryName: "Ready-to-Wear Wigs", shortDescription: "Luxurious silky straight", description: "Premium silky straight wig", price: 1200, compareAtPrice: 1500, stockQuantity: 8, mainImage: "/images/products/silky-straight.jpg", images: ["/images/products/silky-straight.jpg"], isFeatured: true, isBestSeller: false, isNewArrival: true, isActive: true, tags: ["silky straight"], texture: "Silky Straight", length: "16 inches", capSize: "Medium", laceType: "HD Lace" },
  { name: "Brazilian Body Wave Bundle Set", slug: "brazilian-body-wave-bundle-set", categoryName: "Wig Bundles", shortDescription: "Premium Brazilian hair", description: "3 bundle set", price: 650, compareAtPrice: 850, stockQuantity: 25, mainImage: "/images/products/brazilian-body-wave.jpg", images: ["/images/products/brazilian-body-wave.jpg"], isFeatured: true, isBestSeller: true, isNewArrival: false, isActive: true, tags: ["brazilian"], texture: "Body Wave", density: "150%" },
  { name: "HD Lace Closure", slug: "hd-lace-closure", categoryName: "Closures", shortDescription: "Ultra-thin HD lace", description: "Premium HD lace closure", price: 420, stockQuantity: 25, mainImage: "/images/products/hd-closure.jpg", images: ["/images/products/hd-closure.jpg"], isFeatured: true, isBestSeller: false, isNewArrival: true, isActive: true, tags: ["closure"], laceType: "HD Lace", size: "4x4" },
  { name: "HD Lace Frontal", slug: "hd-lace-frontal", categoryName: "Frontals", shortDescription: "Premium HD lace frontal", description: "13x4 HD lace frontal", price: 450, compareAtPrice: 580, stockQuantity: 20, mainImage: "/images/products/hd-frontal.jpg", images: ["/images/products/hd-frontal.jpg"], isFeatured: true, isBestSeller: true, isNewArrival: false, isActive: true, tags: ["frontal"], laceType: "HD Lace", size: "13x4" },
];

// Helper
function categoryNameToSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "-");
}

export async function POST() {
  // Disable in production unless explicitly enabled via env var
  if (!SEED_ENABLED) {
    return NextResponse.json(
      { error: "Seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = new Map<string, Types.ObjectId>();
    createdCategories.forEach((cat) => categoryMap.set(cat.slug, cat._id));

    // Prepare products with category IDs
    const productsWithCategory = products.map((p) => ({
      ...p,
      category: categoryMap.get(categoryNameToSlug(p.categoryName)),
    })).map(({ categoryName, ...rest }) => rest);

    // Insert products
    await Product.insertMany(productsWithCategory);

    const count = await Product.countDocuments({ isActive: true });

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${createdCategories.length} categories and ${productsWithCategory.length} products (${count} active)` 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}