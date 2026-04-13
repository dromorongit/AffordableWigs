import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { Types } from "mongoose";

interface CategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

interface ProductData {
  name: string;
  slug: string;
  categoryName: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  mainImage: string;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  tags: string[];
  texture?: string;
  length?: string;
  capSize?: string;
  laceType?: string;
  density?: string;
  color?: string;
  size?: string;
}

// Sample category data
const categories: CategoryData[] = [
  {
    name: "Ready-to-Wear Wigs",
    slug: "ready-to-wear-wigs",
    description: "Pre-styled wigs ready to wear instantly. Perfect for those who want a beautiful look without the hassle of styling.",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Wig Bundles",
    slug: "wig-bundles",
    description: "Premium hair bundles for custom styling. Create your perfect wig with our high-quality bundles.",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Closures",
    slug: "closures",
    description: "High-quality closures for a natural look. Achieve a seamless finish with our premium closures.",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Frontals",
    slug: "frontals",
    description: "Premium frontals for flawless hairlines. Get that coveted baby hair effect with our frontals.",
    isActive: true,
    sortOrder: 4,
  },
];

// Sample product data - ALL products have isActive: true
const products: ProductData[] = [
  // Ready-to-Wear Wigs
  {
    name: "Classic Body Wave Wig",
    slug: "classic-body-wave-wig",
    categoryName: "Ready-to-Wear Wigs",
    shortDescription: "Elegant body wave texture that flows beautifully. Pre-styled and ready to wear.",
    description: "Our Classic Body Wave Wig features premium quality hair with a beautiful flowing wave pattern. Pre-styled and ready to wear, this wig offers effortless elegance for any occasion. The breathable cap construction ensures all-day comfort.",
    price: 850,
    compareAtPrice: 1200,
    stockQuantity: 15,
    mainImage: "/images/products/classic-body-wave.jpg",
    images: [
      "/images/products/classic-body-wave.jpg",
      "/images/products/classic-body-wave-2.jpg",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    tags: ["body wave", "ready to wear", "premium", "natural"],
    texture: "Body Wave",
    length: "14 inches",
    capSize: "Medium",
    laceType: "Swiss Lace",
  },
  {
    name: "Silky Straight Luxury Unit",
    slug: "silky-straight-luxury-unit",
    categoryName: "Ready-to-Wear Wigs",
    shortDescription: "Luxurious silky straight hair for a sleek, sophisticated look.",
    description: "Experience the ultimate in luxury with our Silky Straight Luxury Unit. Made from 100% virgin hair, this wig features a flawless straight texture that shines beautifully. The transparent lace front creates an incredibly natural hairline.",
    price: 1200,
    compareAtPrice: 1500,
    stockQuantity: 8,
    mainImage: "/images/products/silky-straight.jpg",
    images: [
      "/images/products/silky-straight.jpg",
      "/images/products/silky-straight-2.jpg",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["silky straight", "luxury", "virgin hair", "premium"],
    texture: "Silky Straight",
    length: "16 inches",
    capSize: "Medium",
    laceType: "HD Lace",
  },
  {
    name: "Loose Deep Wave Wig",
    slug: "loose-deep-wave-wig",
    categoryName: "Ready-to-Wear Wigs",
    shortDescription: "Beautiful loose wave pattern with natural volume and movement.",
    description: "Our Loose Deep Wave Wig features a gorgeous wave pattern that adds volume and movement to your look. Perfect for both casual and formal settings, this wig is pre-styled and ready to wear straight out of the box.",
    price: 950,
    stockQuantity: 12,
    mainImage: "/images/products/loose-deep-wave.jpg",
    images: [
      "/images/products/loose-deep-wave.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["loose wave", "deep wave", "volume", "natural"],
    texture: "Loose Deep Wave",
    length: "14 inches",
    capSize: "Medium",
    laceType: "Transparent Lace",
  },
  {
    name: "Curly Boho Wig",
    slug: "curly-boho-wig",
    categoryName: "Ready-to-Wear Wigs",
    shortDescription: "Playful curly wig with a bohemian vibe. Full of personality.",
    description: "Embrace your playful side with our Curly Boho Wig. This fun and flirty wig features beautiful curls that add volume and personality to any look. Low maintenance and pre-styled for effortless beauty.",
    price: 780,
    stockQuantity: 20,
    mainImage: "/images/products/curly-boho.jpg",
    images: [
      "/images/products/curly-boho.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["curly", "boho", "fun", "playful"],
    texture: "Curly",
    length: "12 inches",
    capSize: "Medium",
    laceType: "Regular Lace",
  },

  // Wig Bundles
  {
    name: "Brazilian Body Wave Bundle Set",
    slug: "brazilian-body-wave-bundle-set",
    categoryName: "Wig Bundles",
    shortDescription: "Premium Brazilian hair in beautiful body wave. 3 bundle set for full coverage.",
    description: "Our Brazilian Body Wave Bundle Set includes three bundles of premium quality Brazilian hair. The body wave texture provides beautiful movement and volume. Perfect for creating a custom wig or adding length and volume to your natural hair.",
    price: 650,
    compareAtPrice: 850,
    stockQuantity: 25,
    mainImage: "/images/products/brazilian-body-wave.jpg",
    images: [
      "/images/products/brazilian-body-wave.jpg",
      "/images/products/brazilian-body-wave-2.jpg",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    tags: ["brazilian", "body wave", "bundle", "premium hair"],
    texture: "Body Wave",
    length: "12-18 inches",
    density: "150%",
  },
  {
    name: "Deep Wave Bundle Set",
    slug: "deep-wave-bundle-set",
    categoryName: "Wig Bundles",
    shortDescription: "Gorgeous deep wave pattern for a glamorous look. 3 bundle set.",
    description: "Create show-stopping looks with our Deep Wave Bundle Set. This 3-bundle set features luxurious deep wave hair that holds curls beautifully. The premium quality ensures minimal shedding and tangling.",
    price: 720,
    stockQuantity: 18,
    mainImage: "/images/products/deep-wave-bundle.jpg",
    images: [
      "/images/products/deep-wave-bundle.jpg",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["deep wave", "bundle", "glamorous", "voluminous"],
    texture: "Deep Wave",
    length: "14-20 inches",
    density: "180%",
  },
  {
    name: "Straight Hair Bundle",
    slug: "straight-hair-bundle",
    categoryName: "Wig Bundles",
    shortDescription: "Premium straight hair bundle for sleek, sophisticated styles.",
    description: "Our Straight Hair Bundle features silky smooth straight hair that can be styled, colored, and customized to your heart's content. Made from 100% human hair for the most natural look and feel.",
    price: 480,
    stockQuantity: 30,
    mainImage: "/images/products/straight-bundle.jpg",
    images: [
      "/images/products/straight-bundle.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["straight", "bundle", "versatile", "customizable"],
    texture: "Straight",
    length: "10-16 inches",
    density: "120%",
  },
  {
    name: "Kinky Curly Bundle Set",
    slug: "kinky-curly-bundle-set",
    categoryName: "Wig Bundles",
    shortDescription: "Authentic kinky curly texture for natural, textured looks.",
    description: "Embrace your natural texture with our Kinky Curly Bundle Set. This 3-bundle set features authentic kinky curly hair that maintains its pattern even when straightened. Perfect for versatile styling options.",
    price: 580,
    stockQuantity: 15,
    mainImage: "/images/products/kinky-curly-bundle.jpg",
    images: [
      "/images/products/kinky-curly-bundle.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["kinky curly", "bundle", "natural", "texture"],
    texture: "Kinky Curly",
    length: "12-18 inches",
    density: "150%",
  },

  // Closures
  {
    name: "Transparent Lace Closure",
    slug: "transparent-lace-closure",
    categoryName: "Closures",
    shortDescription: "Premium transparent lace closure for a flawless, seamless finish.",
    description: "Our Transparent Lace Closure features high-quality Swiss lace that blends perfectly with all skin tones. The breathable design ensures comfort while providing a natural-looking part.",
    price: 350,
    compareAtPrice: 450,
    stockQuantity: 40,
    mainImage: "/images/products/transparent-closure.jpg",
    images: [
      "/images/products/transparent-closure.jpg",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    tags: ["closure", "transparent", "lace", "seamless"],
    laceType: "Transparent Swiss Lace",
    size: "4x4",
  },
  {
    name: "HD Lace Closure",
    slug: "hd-lace-closure",
    categoryName: "Closures",
    shortDescription: "Ultra-thin HD lace for the most natural hairline possible.",
    description: "Experience the difference with our HD Lace Closure. The ultra-thin transparent lace creates an undetectable hairline that looks like your own scalp. Perfect for high-definition cameras and up-close viewing.",
    price: 420,
    stockQuantity: 25,
    mainImage: "/images/products/hd-closure.jpg",
    images: [
      "/images/products/hd-closure.jpg",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["closure", "HD lace", "premium", "natural hairline"],
    laceType: "HD Lace",
    size: "4x4",
  },
  {
    name: "Free Part Closure",
    slug: "free-part-closure",
    categoryName: "Closures",
    shortDescription: "Versatile free part closure for flexible styling options.",
    description: "Our Free Part Closure offers ultimate versatility with the ability to create any part style you desire. The durable lace construction ensures long-lasting wear and natural blending.",
    price: 280,
    stockQuantity: 35,
    mainImage: "/images/products/free-part-closure.jpg",
    images: [
      "/images/products/free-part-closure.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["closure", "free part", "versatile", "flexible"],
    laceType: "Swiss Lace",
    size: "4x4",
  },
  {
    name: "360 Lace Closure",
    slug: "360-lace-closure",
    categoryName: "Closures",
    shortDescription: "Full perimeter lace closure for complete styling freedom.",
    description: "Get 360 degrees of styling freedom with our 360 Lace Closure. This premium closure provides coverage all around your head, allowing you to pull your hair up in any style with a completely natural look.",
    price: 520,
    stockQuantity: 12,
    mainImage: "/images/products/360-closure.jpg",
    images: [
      "/images/products/360-closure.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["closure", "360 lace", "full coverage", "versatile"],
    laceType: "Swiss Lace",
    size: "360",
  },

  // Frontals
  {
    name: "HD Lace Frontal",
    slug: "hd-lace-frontal",
    categoryName: "Frontals",
    shortDescription: "Premium HD lace frontal for flawless hairlines and baby hair effects.",
    description: "Our HD Lace Frontal features the finest quality HD lace for an incredibly natural look. Create the perfect baby hair effect and achieve a seamless hairline that looks completely natural.",
    price: 450,
    compareAtPrice: 580,
    stockQuantity: 20,
    mainImage: "/images/products/hd-frontal.jpg",
    images: [
      "/images/products/hd-frontal.jpg",
      "/images/products/hd-frontal-2.jpg",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    tags: ["frontal", "HD lace", "baby hair", "premium"],
    laceType: "HD Lace",
    size: "13x4",
  },
  {
    name: "Swiss Lace Frontal",
    slug: "swiss-lace-frontal",
    categoryName: "Frontals",
    shortDescription: "Soft and breathable Swiss lace frontal for all-day comfort.",
    description: "Experience superior comfort with our Swiss Lace Frontal. The soft, breathable lace allows for comfortable all-day wear while providing a natural-looking hairline and part.",
    price: 380,
    stockQuantity: 28,
    mainImage: "/images/products/swiss-frontal.jpg",
    images: [
      "/images/products/swiss-frontal.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["frontal", "swiss lace", "comfortable", "natural"],
    laceType: "Swiss Lace",
    size: "13x4",
  },
  {
    name: "13x6 Lace Frontal",
    slug: "13x6-lace-frontal",
    categoryName: "Frontals",
    shortDescription: "Larger coverage frontal for more styling options and versatility.",
    description: "Our 13x6 Lace Frontal provides more coverage than standard frontals, offering additional styling options. Create deeper parts and more versatile styles with this premium frontal piece.",
    price: 480,
    stockQuantity: 18,
    mainImage: "/images/products/13x6-frontal.jpg",
    images: [
      "/images/products/13x6-frontal.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    tags: ["frontal", "13x6", "versatile", "full coverage"],
    laceType: "Swiss Lace",
    size: "13x6",
  },
  {
    name: "Transparent Frontal",
    slug: "transparent-frontal",
    categoryName: "Frontals",
    shortDescription: "Transparent lace frontal that matches all skin tones seamlessly.",
    description: "Our Transparent Frontal is designed to blend perfectly with all skin tones. The high-quality transparent lace creates an invisible hairline that works for everyone.",
    price: 400,
    stockQuantity: 22,
    mainImage: "/images/products/transparent-frontal.jpg",
    images: [
      "/images/products/transparent-frontal.jpg",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    tags: ["frontal", "transparent", "all skin tones", "versatile"],
    laceType: "Transparent Lace",
    size: "13x4",
  },
];

// Helper function to convert category name to slug
function categoryNameToSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "-");
}

async function seedDatabase() {
  console.log("🌱 Starting database seed...");
  console.log("-----------------------------------");

  // Check for MONGODB_URI
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set!");
    console.error("   Please set MONGODB_URI before running the seed script.");
    console.error("   Example: MONGODB_URI=mongodb://... npm run seed");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");
    console.log(`   Connection: ${process.env.MONGODB_URI.replace(/\/\/.*?:.*?@/, "//***:***@")}`);
    console.log("-----------------------------------");

    // Check existing data
    const existingCategories = await Category.countDocuments();
    const existingProducts = await Product.countDocuments();
    console.log(`📊 Existing data:`);
    console.log(`   Categories: ${existingCategories}`);
    console.log(`   Products: ${existingProducts}`);
    console.log("-----------------------------------");

    // Clear existing data (safe for reseeding)
    console.log("🗑️  Clearing existing categories and products...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("✅ Cleared existing data");
    console.log("-----------------------------------");

    // Create categories with upsert-style approach
    console.log("📁 Inserting categories...");
    let categoriesInserted = 0;
    for (const cat of categories) {
      await Category.updateOne(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true }
      );
      categoriesInserted++;
    }
    console.log(`✅ Inserted ${categoriesInserted} categories`);

    // Get created categories
    const createdCategories = await Category.find().lean();
    console.log("-----------------------------------");

    // Create category slug to ObjectId map
    const categoryMap = new Map<string, Types.ObjectId>();
    createdCategories.forEach((cat) => {
      categoryMap.set(cat.slug, cat._id as Types.ObjectId);
    });

    // Map products to include category ObjectId
    const productsWithCategory = products.map((product) => {
      const categorySlug = categoryNameToSlug(product.categoryName);
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`⚠️  Warning: Category not found for product "${product.name}"`);
      }
      return {
        ...product,
        category: categoryId,
      };
    });

    // Filter products that have valid category and prepare for insert
    const productsToInsert = productsWithCategory
      .filter((p) => p.category)
      .map(({ categoryName, ...rest }) => rest);

    // Insert products
    console.log("📦 Inserting products...");
    let productsInserted = 0;
    for (const product of productsToInsert) {
      await Product.updateOne(
        { slug: product.slug },
        { $set: product },
        { upsert: true }
      );
      productsInserted++;
    }
    console.log(`✅ Inserted ${productsInserted} products`);
    console.log("-----------------------------------");

    // Verify the data
    const finalCategories = await Category.countDocuments();
    const finalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    console.log("📊 Final data:");
    console.log(`   Categories: ${finalCategories}`);
    console.log(`   Products (total): ${finalProducts}`);
    console.log(`   Products (active): ${activeProducts}`);
    console.log("-----------------------------------");

    console.log("🎉 Database seeding completed successfully!");
    console.log("");
    console.log("Next steps:");
    console.log("   1. Visit /shop to see products");
    console.log("   2. Visit /shop/[slug] for product details");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:");
    console.error(error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
