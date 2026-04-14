"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/constants";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/cart";
import { Container, Section } from "@/components/ui";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const hasImageError = (productId: string) => imageErrors.has(productId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-20">
      <Section background="cream" padding="sm">
        <Container>
          <h1 className="font-heading text-3xl md:text-4xl text-text-primary">
            Shopping Cart
          </h1>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container>
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-24 h-24 text-neutral-light mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="font-heading text-2xl text-text-primary mb-4">
                Your cart is empty
              </h2>
              <p className="text-text-light mb-8 max-w-md">
                Looks like you haven't added any products to your cart yet. Browse our collection to find the perfect wig for you.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-primary text-white rounded-premium font-medium hover:bg-primary-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-background rounded-premium p-6 border border-neutral-light">
                  <h2 className="font-heading text-xl text-text-primary mb-6">
                    Cart Items ({cart.items.length})
                  </h2>

                  <div className="space-y-6">
                    {cart.items.map((item: CartItem) => (
                      <div
                        key={item.product._id}
                        className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-neutral-light last:border-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="relative w-full sm:w-28 h-32 sm:h-36 flex-shrink-0 bg-background-ivory rounded-md overflow-hidden">
                          {item.product.mainImage && !hasImageError(item.product._id.toString()) ? (
                            <Image
                              src={item.product.mainImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(item.product._id.toString())}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-12 h-12 text-neutral-nude" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-neutral-taupe mb-1">
                                {item.product.category?.name || "Wigs"}
                              </p>
                              <Link
                                href={`/shop/${item.product.slug}`}
                                className="font-heading text-lg text-text-primary hover:text-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="p-2 text-neutral-taupe hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <p className="text-lg font-medium text-text-primary mt-2">
                            {BRAND.currencySymbol}{item.product.price.toLocaleString()}
                          </p>

                          {/* Quantity Controls */}
                          <div className="mt-auto pt-4 flex items-center gap-4">
                            <span className="text-sm text-text-light">Quantity</span>
                            <div className="flex items-center border border-neutral-light rounded-premium">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center text-text-light hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-12 h-10 flex items-center justify-center border-x border-neutral-light text-text-primary font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-text-light hover:text-text-primary transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clear Cart */}
                  <div className="mt-6 pt-6 border-t border-neutral-light">
                    <button
                      onClick={clearCart}
                      className="text-sm text-neutral-taupe hover:text-red-500 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-background rounded-premium p-6 border border-neutral-light sticky top-24">
                  <h2 className="font-heading text-xl text-text-primary mb-6">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3 border-b border-neutral-light">
                    <span className="text-text-light">Subtotal</span>
                    <span className="text-lg font-medium text-text-primary">
                      {BRAND.currencySymbol}{cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Shipping Note */}
                  <div className="py-3 text-sm text-text-light">
                    <p>Shipping will be calculated at checkout.</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-3 border-t border-neutral-light">
                    <span className="font-medium text-text-primary">Total</span>
                    <span className="text-xl font-medium text-text-primary">
                      {BRAND.currencySymbol}{cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="block w-full mt-6 py-3 bg-primary text-white text-center rounded-premium font-medium hover:bg-primary-700 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/shop"
                    className="block w-full mt-3 py-3 text-text-light text-center hover:text-text-primary transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {/* Secure Checkout Note */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-taupe">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Checkout with Paystack
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}