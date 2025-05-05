import type { Cart, Product } from "@/utils/types";

export type LocalCartItem = {
  productId: number;
  quantity: number;
  product: Product;
};

export type LocalCart = {
  items: LocalCartItem[];
  lastUpdated: number;
};

const CART_STORAGE_KEY = "user-cart";

export function saveCartToLocalStorage(cart: LocalCart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function getCartFromLocalStorage(): LocalCart | null {
  if (typeof window === "undefined") return null;

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;

    return JSON.parse(cartData) as LocalCart;
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return null;
  }
}

export function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function backendCartToLocalCart(cart: Cart): LocalCart {
  return {
    items: cart.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      product: item.product,
    })),
    lastUpdated: Date.now(),
  };
}

// Convert local cart to format needed for backend sync
export function localCartToBackendFormat(localCart: LocalCart) {
  return localCart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}
