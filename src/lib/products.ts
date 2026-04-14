import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Service from "@/models/Service";
import Review from "@/models/Review";

export interface ProductSortOption {
  label: string;
  value: string;
}

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { label: "Newest", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Featured", value: "-isFeatured" },
];

export interface GetProductsQuery {
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
  page?: number;
}

export interface ProductsResult {
  products: Awaited<ReturnType<typeof getProducts>>;
  total: number;
  page: number;
  totalPages: number;
  categories: Awaited<ReturnType<typeof getCategories>>;
}

// Flag to track if DB is connected
let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("MongoDB connection error - continuing without database");
      return false;
    }
  }
  return true;
}

/**
 * Fetch all active categories
 */
export async function getCategories() {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];
    
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const connected = await ensureConnection();
    if (!connected) return null;
    
    const category = await Category.findOne({ slug, isActive: true })
      .lean()
      .exec();

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

/**
 * Fetch products with optional filtering, sorting, and pagination
 */
export async function getProducts(query: GetProductsQuery = {}) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const {
      category,
      search,
      sort = "-createdAt",
      featured,
      bestSeller,
      newArrival,
      limit = 20,
      page = 1,
    } = query;

    // Build the filter object
    const filter: Record<string, unknown> = { isActive: true };

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter (searches name and tags)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Featured filter
    if (featured) {
      filter.isFeatured = true;
    }

    // Best seller filter
    if (bestSeller) {
      filter.isBestSeller = true;
    }

    // New arrival filter
    if (newArrival) {
      filter.isNewArrival = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with sorting and pagination
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get total count of products matching the filter
 */
export async function getProductsCount(query: Omit<GetProductsQuery, "page" | "limit"> = {}) {
  try {
    const connected = await ensureConnection();
    if (!connected) return 0;

    const { category, search, featured, bestSeller, newArrival } = query;

    const filter: Record<string, unknown> = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (featured) {
      filter.isFeatured = true;
    }

    if (bestSeller) {
      filter.isBestSeller = true;
    }

    if (newArrival) {
      filter.isNewArrival = true;
    }

    const count = await Product.countDocuments(filter).exec();
    return count;
  } catch (error) {
    console.error("Error counting products:", error);
    return 0;
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const connected = await ensureConnection();
    if (!connected) return null;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean()
      .exec();

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Fetch related products based on category
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const products = await Product.find({
      _id: { $ne: productId },
      category: categoryId,
      isActive: true,
    })
      .populate("category", "name slug")
      .limit(limit)
      .lean()
      .exec();

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(limit)
      .lean()
      .exec();

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetch best seller products
 */
export async function getBestSellerProducts(limit = 4) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const products = await Product.find({
      isBestSeller: true,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(limit)
      .lean()
      .exec();

    return products;
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

/**
 * Fetch new arrival products
 */
export async function getNewArrivalProducts(limit = 4) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const products = await Product.find({
      isNewArrival: true,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(limit)
      .lean()
      .exec();

    return products;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

/**
 * Fetch all active services
 */
export async function getServices() {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const services = await Service.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

/**
 * Fetch visible reviews
 */
export async function getVisibleReviews(limit = 10) {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const reviews = await Review.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

/**
 * Fetch all visible reviews (for reviews page)
 */
export async function getAllVisibleReviews() {
  try {
    const connected = await ensureConnection();
    if (!connected) return [];

    const reviews = await Review.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return reviews;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
}

/**
 * Get total count of visible reviews
 */
export async function getReviewsCount() {
  try {
    const connected = await ensureConnection();
    if (!connected) return 0;

    const count = await Review.countDocuments({ isVisible: true }).exec();
    return count;
  } catch (error) {
    console.error("Error counting reviews:", error);
    return 0;
  }
}

/**
 * Calculate average rating from visible reviews
 */
export async function getAverageRating() {
  try {
    const connected = await ensureConnection();
    if (!connected) return 0;

    const reviews = await Review.find({ isVisible: true }).lean().exec();
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
}
