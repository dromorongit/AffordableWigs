"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BRAND } from "@/constants";

interface Product {
  _id: { toString(): string } | string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  mainImage: string;
  images?: string[];
  shortDescription?: string;
  category?: {
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const {
    name,
    slug,
    price,
    compareAtPrice,
    mainImage,
    category,
    isFeatured,
    isBestSeller,
    isNewArrival,
  } = product;

  // Determine the badge to display
  const getBadge = () => {
    if (isNewArrival) return { text: "New", className: "bg-primary" };
    if (isBestSeller) return { text: "Best Seller", className: "bg-text-primary" };
    if (isFeatured) return { text: "Featured", className: "bg-text-secondary" };
    return null;
  };

  const badge = getBadge();

  return (
    <Link href={`/shop/${slug}`} className="group block h-full">
      <div className="bg-background rounded-premium overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-background-sand to-background-ivory overflow-hidden">
          {mainImage && !imageError ? (
            <Image
              src={mainImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-neutral-nude" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          )}
          
          {/* Badge */}
          {badge && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full ${badge.className}`}>
              <span className="text-xs font-medium text-white">
                {badge.text}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-neutral-taupe mb-1">
            {category?.name || "Uncategorized"}
          </p>
          <h3 className="font-heading text-base text-text-primary group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="mt-auto pt-3 flex items-center gap-2">
            <span className="text-lg font-medium text-text-primary">
              {BRAND.currencySymbol}{price.toLocaleString()}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm text-neutral-taupe line-through">
                {BRAND.currencySymbol}{compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
