"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItemProduct } from "@/types/cart";
import { IProductPopulated } from "@/types/product";
import { BRAND, CONTACT } from "@/constants";
import { Button } from "@/components/ui";
import { FiCheck, FiMessageCircle, FiShoppingBag } from "react-icons/fi";

interface ProductInfoPanelProps {
  product: IProductPopulated;
}

// Convert IProductPopulated to CartItemProduct
function convertToCartProduct(product: IProductPopulated): CartItemProduct {
  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    mainImage: product.mainImage,
    shortDescription: product.shortDescription,
    category: product.category ? {
      name: product.category.name,
      slug: product.category.slug,
    } : undefined,
  };
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddToCart = () => {
    if (!isInStock) return;
    
    setIsAdding(true);
    const cartProduct = convertToCartProduct(product);
    addToCart(cartProduct, quantity);
    
    // Show feedback briefly
    setTimeout(() => {
      setIsAdding(false);
      setIsCartOpen(true);
    }, 500);
  };

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

      {/* Quantity Selector */}
      {isInStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-gray">Quantity</span>
          <div className="flex items-center border border-brand-light-gray rounded-premium">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-brand-gray hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 h-10 flex items-center justify-center border-x border-brand-light-gray text-brand-black font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
              disabled={quantity >= stockQuantity}
              className="w-10 h-10 flex items-center justify-center text-brand-gray hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      {isInStock && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </>
          ) : (
            <>
              <FiShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </Button>
      )}

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
