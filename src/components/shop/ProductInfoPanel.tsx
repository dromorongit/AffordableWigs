"use client";

import Link from "next/link";
import { IProductPopulated } from "@/types/product";
import { BRAND, CONTACT } from "@/constants";
import { Button } from "@/components/ui";
import { FiCheck, FiMessageCircle } from "react-icons/fi";

interface ProductInfoPanelProps {
  product: IProductPopulated;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const {
    name,
    price,
    compareAtPrice,
    category,
    shortDescription,
    description,
    stockQuantity,
    isNewArrival,
    isBestSeller,
    isFeatured,
    tags,
    length,
    texture,
    capSize,
    laceType,
    density,
  } = product;

  // Determine badges
  const badges: { text: string; className: string }[] = [];
  if (isNewArrival) badges.push({ text: "New Arrival", className: "bg-brand-gold text-brand-white" });
  if (isBestSeller) badges.push({ text: "Best Seller", className: "bg-brand-black text-brand-white" });
  if (isFeatured) badges.push({ text: "Featured", className: "bg-brand-charcoal text-brand-white" });

  const isInStock = stockQuantity > 0;
  const whatsAppMessage = encodeURIComponent(
    `Hi Affordable Wigs Gh, I'm interested in "${name}". Is it available?`
  );
  const whatsAppLink = `${CONTACT.whatsappLink}?text=${whatsAppMessage}`;

  return (
    <div className="space-y-6">
      {/* Category */}
      {category && (
        <Link
          href={`/shop?category=${category.slug}`}
          className="text-sm text-brand-gold hover:underline"
        >
          {category.name}
        </Link>
      )}

      {/* Product Name */}
      <h1 className="font-heading text-3xl md:text-4xl text-brand-black">
        {name}
      </h1>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}

      {/* Short Description */}
      {shortDescription && (
        <p className="text-brand-gray text-lg">{shortDescription}</p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-medium text-brand-black">
          {BRAND.currencySymbol}{price.toLocaleString()}
        </span>
        {compareAtPrice && compareAtPrice > price && (
          <span className="text-xl text-brand-taupe line-through">
            {BRAND.currencySymbol}{compareAtPrice.toLocaleString()}
          </span>
        )}
        {compareAtPrice && compareAtPrice > price && (
          <span className="px-2 py-1 bg-brand-gold text-brand-white text-xs font-medium rounded">
            Save {BRAND.currencySymbol}{(compareAtPrice - price).toLocaleString()}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <>
            <FiCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              In Stock ({stockQuantity} available)
            </span>
          </>
        ) : (
          <span className="text-sm text-red-600 font-medium">
            Out of Stock
          </span>
        )}
      </div>

      {/* WhatsApp Inquiry Button */}
      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <Button
          variant="secondary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
        >
          <FiMessageCircle className="w-5 h-5" />
          Inquire on WhatsApp
        </Button>
      </a>

      {/* Description */}
      {description && (
        <div className="pt-4 border-t border-brand-nude">
          <h3 className="font-heading text-lg mb-3">Description</h3>
          <div className="text-brand-gray leading-relaxed whitespace-pre-line">
            {description}
          </div>
        </div>
      )}

      {/* Product Specifications */}
      {(length || texture || capSize || laceType || density) && (
        <div className="pt-4 border-t border-brand-nude">
          <h3 className="font-heading text-lg mb-3">Specifications</h3>
          <div className="space-y-2">
            {texture && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-taupe">Texture</span>
                <span className="text-brand-black font-medium">{texture}</span>
              </div>
            )}
            {length && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-taupe">Length</span>
                <span className="text-brand-black font-medium">{length}</span>
              </div>
            )}
            {capSize && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-taupe">Cap Size</span>
                <span className="text-brand-black font-medium">{capSize}</span>
              </div>
            )}
            {laceType && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-taupe">Lace Type</span>
                <span className="text-brand-black font-medium">{laceType}</span>
              </div>
            )}
            {density && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-taupe">Density</span>
                <span className="text-brand-black font-medium">{density}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="pt-4 border-t border-brand-nude">
          <h3 className="font-heading text-sm mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/shop?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-xs bg-brand-sand text-brand-gray rounded-full hover:bg-brand-nude transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductInfoPanel;
