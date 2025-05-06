"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteData, patchData, postData } from "@/utils/api-utils";
import {
  getCartFromLocalStorage,
  type LocalCart,
  type LocalCartItem,
  saveCartToLocalStorage,
} from "@/utils/cart-storage";
import { serverRevalidate } from "@/utils/revalidatePath";
import type { Cart, Product } from "@/utils/types";

type UseCartProps = {
  serverCart?: Cart;
  isLoggedIn: boolean;
};

export function useCart({ serverCart, isLoggedIn }: UseCartProps) {
  const [localCart, setLocalCart] = useState<LocalCart | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart from localStorage or server
  useEffect(() => {
    if (isInitialized) return;

    if (isLoggedIn && serverCart) {
      // User is logged in and we have server cart data
      setLocalCart(null); // Don't need local cart
    } else {
      // User is not logged in, use localStorage
      const storedCart = getCartFromLocalStorage();
      if (storedCart) {
        setLocalCart(storedCart);
      } else {
        // Initialize empty cart
        setLocalCart({ items: [], lastUpdated: Date.now() });
      }
    }

    setIsInitialized(true);
  }, [isLoggedIn, serverCart, isInitialized]);

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoggedIn && localCart) {
      saveCartToLocalStorage(localCart);
    }
  }, [localCart, isLoggedIn]);

  // Sync local cart with server when user logs in
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (isLoggedIn && localCart && localCart.items.length > 0) {
        setIsLoading(true);
        try {
          // For each item in local cart, add to server cart
          for (const item of localCart.items) {
            await postData("cart/items", {
              productId: item.productId,
              quantity: item.quantity,
            });
          }

          // Clear local cart after successful sync
          setLocalCart(null);
          saveCartToLocalStorage({ items: [], lastUpdated: Date.now() });

          // Revalidate cart page
          serverRevalidate("/");
          serverRevalidate("/cart");

          toast.success("Cart synced successfully", {
            description: "Your cart has been synced with your account",
          });
        } catch (error) {
          console.error("Error syncing cart:", error);
          toast.error("Failed to sync cart", {
            description: "Please try again later",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    syncCartWithServer();
  }, [isLoggedIn, localCart]);

  // Add item to cart
  const addItem = async (product: Product, quantity = 1) => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        // Add to server cart
        await postData("cart/items", {
          productId: product.id,
          quantity,
        });

        // Revalidate cart
        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
        // Add to local cart
        setLocalCart((prev) => {
          if (!prev)
            return {
              items: [{ productId: product.id, quantity, product }],
              lastUpdated: Date.now(),
            };

          const existingItemIndex = prev.items.findIndex(
            (item) => item.productId === product.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...prev.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };

            return {
              ...prev,
              items: updatedItems,
              lastUpdated: Date.now(),
            };
          } else {
            // Add new item
            return {
              ...prev,
              items: [
                ...prev.items,
                { productId: product.id, quantity, product },
              ],
              lastUpdated: Date.now(),
            };
          }
        });
      }

      toast.success("Item added to cart", {
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (
    itemId: number | string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        // Update server cart
        await patchData(`cart/items/${itemId}`, { quantity });

        // Revalidate cart
        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
        // Update local cart
        setLocalCart((prev) => {
          if (!prev) return null;

          const updatedItems = prev.items.map((item) => {
            if (typeof itemId === "number" && item.productId === itemId) {
              return { ...item, quantity };
            }
            return item;
          });

          return {
            ...prev,
            items: updatedItems,
            lastUpdated: Date.now(),
          };
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Failed to update quantity", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: number | string) => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        // Remove from server cart
        await deleteData("cart/items", itemId);

        // Revalidate cart
        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
        // Remove from local cart
        setLocalCart((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            items: prev.items.filter((item) => {
              if (typeof itemId === "number") {
                return item.productId !== itemId;
              }
              return true;
            }),
            lastUpdated: Date.now(),
          };
        });
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        await deleteData("cart", "");

        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
        setLocalCart({ items: [], lastUpdated: Date.now() });
        saveCartToLocalStorage({ items: [], lastUpdated: Date.now() });
      }

      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotals = () => {
    const items =
      isLoggedIn && serverCart ? serverCart.items : localCart?.items || [];

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const originalSubtotal = items.reduce((sum, item) => {
      const price = isLoggedIn
        ? item.product.sellingPrice
        : (item as LocalCartItem).product.sellingPrice;
      return sum + price * item.quantity;
    }, 0);

    const discountedSubtotal = items.reduce((sum, item) => {
      const product = isLoggedIn
        ? item.product
        : (item as LocalCartItem).product;
      const discountedPrice = getDiscountedPrice(product);
      return sum + discountedPrice * item.quantity;
    }, 0);

    const productDiscounts = originalSubtotal - discountedSubtotal;

    return {
      itemCount,
      originalSubtotal,
      discountedSubtotal,
      productDiscounts,
    };
  };

  const getDiscountedPrice = (product: Product) => {
    const now = new Date();
    const startDate = new Date(product.discountStartDate ?? 0);
    const endDate = new Date(product.discountEndDate ?? 0);

    if (
      product.discountType &&
      product.discountValue &&
      now >= startDate &&
      now <= endDate
    ) {
      return product.discountType === "fixed"
        ? product.sellingPrice - product.discountValue
        : product.sellingPrice * (1 - product.discountValue / 100);
    }
    return product.sellingPrice;
  };

  return {
    cart: isLoggedIn ? serverCart : { items: localCart?.items || [] },
    isLoading,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getCartTotals,
    getDiscountedPrice,
  };
}
