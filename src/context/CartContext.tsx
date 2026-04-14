"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartItem, CartState, CartItemProduct } from "@/types/cart";

interface CartContextType {
  cart: CartState;
  addToCart: (product: CartItemProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "affordable_wigs_cart";

function getInitialCart(): CartState {
  return {
    items: [],
    subtotal: 0,
  };
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

function saveCartToStorage(cart: CartState): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }
}

function loadCartFromStorage(): CartState {
  if (typeof window === "undefined") {
    return getInitialCart();
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        subtotal: calculateSubtotal(parsed.items || []),
      };
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
  return getInitialCart();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(getInitialCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    setCart(loadedCart);
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(cart);
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback((product: CartItemProduct, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.product._id === product._id
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity of existing item
        newItems = prevCart.items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }

      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product._id !== productId
      );
      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(getInitialCart());
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;