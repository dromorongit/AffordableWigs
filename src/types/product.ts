// Type definitions for the product catalog

import { Types } from "mongoose";

export interface ICategoryPopulated {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductPopulated {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category: ICategoryPopulated;
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
  isActive: boolean;
  tags: string[];
  length?: string;
  texture?: string;
  color?: string;
  capSize?: string;
  laceType?: string;
  density?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for simplified product display
export interface ProductCardProps {
  product: IProductPopulated;
}

// Type for product detail page
export interface ProductDetailProps {
  product: IProductPopulated;
}

// Type for category filter
export interface CategoryFilterProps {
  categories: ICategoryPopulated[];
  activeCategory?: string;
}

// Type for sort options
export type SortOption = "newest" | "price-asc" | "price-desc" | "featured";

// Helper type for URL search params
export interface ShopFilters {
  category?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
}
