"use client";

import type { LocalCoupon } from "@/utils/cart-storage";
import type { Cart, Product } from "@/utils/types";
import { createContext, useContext } from "react";

type CartContextType = {
  cart: Cart | { items: any[] };
  isLoading: boolean;
  appliedCoupon: LocalCoupon | null; // Added coupon property
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateItemQuantity: (
    itemId: number | string,
    quantity: number
  ) => Promise<void>;
  removeItem: (itemId: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string, subtotal: number) => Promise<void>; // Added apply coupon method
  removeCoupon: () => void; // Added remove coupon method
  getCartTotals: () => {
    itemCount: number;
    originalSubtotal: number;
    discountedSubtotal: number;
    productDiscounts: number;
  };
  getDiscountedPrice: (product: Product) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}

export { CartContext };
