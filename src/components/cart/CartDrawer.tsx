"use client";

import { useCart } from "@/context/CartContext";
import { BRAND } from "@/constants";
import { CartItem } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-light-gray">
          <h2 className="font-heading text-xl font-semibold text-brand-black">
            Your Cart ({cart.items.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-brand-gray hover:text-brand-black transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-brand-light-gray mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-brand-gray mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-brand-gold hover:text-brand-black transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-4 bg-brand-sand/30 rounded-premium"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-24 flex-shrink-0 bg-brand-ivory rounded-md overflow-hidden">
                    {item.product.mainImage ? (
                      <Image
                        src={item.product.mainImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-brand-nude" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-heading text-sm font-medium text-brand-black line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-brand-taupe mt-1">
                      {BRAND.currencySymbol}{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-brand-light-gray rounded-md text-brand-gray hover:text-brand-black hover:border-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-brand-black w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-brand-light-gray rounded-md text-brand-gray hover:text-brand-black hover:border-brand-black transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="self-start p-1 text-brand-taupe hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-6 border-t border-brand-light-gray bg-brand-sand/20">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-brand-gray">Subtotal</span>
              <span className="text-lg font-medium text-brand-black">
                {BRAND.currencySymbol}{cart.subtotal.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full py-3 bg-brand-black text-brand-white text-center rounded-premium font-medium hover:bg-brand-charcoal transition-colors"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full py-3 mt-3 text-brand-gray text-center hover:text-brand-black transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}