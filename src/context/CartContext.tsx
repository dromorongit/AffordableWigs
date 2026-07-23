"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartItem, CartState, CartItemProduct } from "@/types/cart";
import { BRAND, STYLING_OPTIONS } from "@/constants";

interface CartContextType {
  cart: CartState;
  addToCart: (product: CartItemProduct, quantity?: number, stylingType?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateStyling: (productId: string, stylingType: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  revalidateCartStock: () => string[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "affordable_wigs_cart";

function getDefaultStyling(): { stylingType: string; stylingName: string; stylingPrice: number } {
  return { stylingType: "none", stylingName: "No Styling", stylingPrice: 0 };
}

function getInitialCart(): CartState {
  return {
    items: [],
    subtotal: 0,
    stylingTotal: 0,
    total: 0,
  };
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

function calculateStylingTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.stylingPrice * item.quantity, 0);
}

function migrateCartItems(items: any[]): CartItem[] {
  return items.map((item) => {
    if (item.stylingType !== undefined) {
      return item as CartItem;
    }
    const defaultStyling = getDefaultStyling();
    return {
      product: item.product,
      quantity: item.quantity,
      ...defaultStyling,
    };
  });
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
      const items = migrateCartItems(parsed.items || []);
      const subtotal = calculateSubtotal(items);
      const stylingTotal = calculateStylingTotal(items);
      return {
        items,
        subtotal,
        stylingTotal,
        total: subtotal + stylingTotal,
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

  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    setCart(loadedCart);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(cart);
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback((product: CartItemProduct, quantity: number = 1, stylingType: string = "none") => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.product._id === product._id
      );

      const stylingOption = STYLING_OPTIONS.find((s) => s.id === stylingType) || STYLING_OPTIONS[0];
      const styling = { stylingType: stylingOption.id, stylingName: stylingOption.name, stylingPrice: stylingOption.price };

      let newItems: CartItem[];

      if (existingItem) {
        newItems = prevCart.items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity, ...styling }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity, ...styling }];
      }

      const subtotal = calculateSubtotal(newItems);
      const stylingTotal = calculateStylingTotal(newItems);
      return { items: newItems, subtotal, stylingTotal, total: subtotal + stylingTotal };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product._id !== productId
      );
      const subtotal = calculateSubtotal(newItems);
      const stylingTotal = calculateStylingTotal(newItems);
      return { items: newItems, subtotal, stylingTotal, total: subtotal + stylingTotal };
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
      const subtotal = calculateSubtotal(newItems);
      const stylingTotal = calculateStylingTotal(newItems);
      return { items: newItems, subtotal, stylingTotal, total: subtotal + stylingTotal };
    });
  }, []);

  const updateStyling = useCallback((productId: string, stylingType: string) => {
    setCart((prevCart) => {
      const stylingOption = STYLING_OPTIONS.find((s) => s.id === stylingType) || STYLING_OPTIONS[0];
      const newItems = prevCart.items.map((item) =>
        item.product._id === productId
          ? { ...item, stylingType: stylingOption.id, stylingName: stylingOption.name, stylingPrice: stylingOption.price }
          : item
      );
      const subtotal = calculateSubtotal(newItems);
      const stylingTotal = calculateStylingTotal(newItems);
      return { items: newItems, subtotal, stylingTotal, total: subtotal + stylingTotal };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(getInitialCart());
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const revalidateCartStock = useCallback((): string[] => {
    const problemItems: string[] = [];
    for (const item of cart.items) {
      const availableStock = item.product.stockQuantity ?? 0;
      if (availableStock <= 0) {
        problemItems.push(`${item.product.name} (out of stock)`);
      } else if (item.quantity > availableStock) {
        problemItems.push(
          `${item.product.name} (only ${availableStock} left, you have ${item.quantity})`
        );
      }
    }
    return problemItems;
  }, [cart.items]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateStyling,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        revalidateCartStock,
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
