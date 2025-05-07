"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  applyCoupon as applyCouponApi,
  validateCoupon,
} from "@/lib/coupon-service";
import { deleteData, patchData, postData } from "@/utils/api-utils";
import {
  backendCouponToLocalCoupon,
  clearLocalCoupon,
  getCartFromLocalStorage,
  getCouponFromLocalStorage,
  type LocalCart,
  type LocalCartItem,
  type LocalCoupon,
  saveCartToLocalStorage,
  saveCouponToLocalStorage,
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
  const [appliedCoupon, setAppliedCoupon] = useState<LocalCoupon | null>(null);

  useEffect(() => {
    if (isInitialized) return;

    if (isLoggedIn && serverCart) {
      setLocalCart(null);
      // For logged-in users, we would fetch the coupon from the server
      // This would be implemented in your backend
    } else {
      const storedCart = getCartFromLocalStorage();
      const storedCoupon = getCouponFromLocalStorage();

      if (storedCart) {
        setLocalCart(storedCart);
      } else {
        setLocalCart({ items: [], lastUpdated: Date.now() });
      }

      if (storedCoupon) {
        setAppliedCoupon(storedCoupon);
      }
    }

    setIsInitialized(true);
  }, [isLoggedIn, serverCart, isInitialized]);

  useEffect(() => {
    if (!isLoggedIn && localCart) {
      saveCartToLocalStorage(localCart);
    }
  }, [localCart, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn && appliedCoupon) {
      saveCouponToLocalStorage(appliedCoupon);
    }
  }, [appliedCoupon, isLoggedIn]);

  useEffect(() => {
    const syncCartWithServer = async () => {
      if (isLoggedIn && localCart && localCart.items.length > 0) {
        setIsLoading(true);
        try {
          for (const item of localCart.items) {
            await postData("cart/items", {
              productId: item.productId,
              quantity: item.quantity,
            });
          }

          // If there's a coupon applied locally, apply it to the server cart too
          if (appliedCoupon) {
            try {
              await applyCouponApi(
                appliedCoupon.code,
                getCartTotals().discountedSubtotal
              );
            } catch (error) {
              console.error("Error syncing coupon:", error);
              // Don't fail the whole sync if just the coupon fails
            }
          }

          setLocalCart(null);
          saveCartToLocalStorage({ items: [], lastUpdated: Date.now() });
          clearLocalCoupon();

          serverRevalidate("/");
          serverRevalidate("/cart");
          serverRevalidate("/checkout");

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
  }, [isLoggedIn, localCart, appliedCoupon]);

  const addItem = async (product: Product, quantity = 1) => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        await postData("cart/items", {
          productId: product.id,
          quantity,
        });

        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
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

  const updateItemQuantity = async (
    itemId: number | string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        await patchData(`cart/items/${itemId}`, { quantity });

        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
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

  const removeItem = async (itemId: number | string) => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        await deleteData("cart/items", itemId);

        serverRevalidate("/");
        serverRevalidate("/cart");
      } else {
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
        // Also clear any applied coupon
        setAppliedCoupon(null);
        clearLocalCoupon();
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

  // New method to apply a coupon
  const applyCoupon = async (code: string, subtotal: number) => {
    if (!code.trim()) return;
    setIsLoading(true);

    try {
      // Validate the coupon first
      const validationRes = await validateCoupon(code);
      if (validationRes.statusCode !== 200) {
        throw new Error(validationRes.message || "Coupon validation failed");
      }

      // Apply the coupon
      const applyRes = await applyCouponApi(code, subtotal);

      if (applyRes.statusCode === 200 && applyRes.data) {
        const couponData = backendCouponToLocalCoupon(
          code,
          applyRes.data.discountValue
        );

        setAppliedCoupon(couponData);

        if (!isLoggedIn) {
          saveCouponToLocalStorage(couponData);
        } else {
          serverRevalidate("/cart");
          serverRevalidate("/checkout");
        }

        toast.success("Coupon applied successfully");
        return;
      } else {
        throw new Error(applyRes.message || "Failed to apply coupon");
      }
    } catch (error) {
      console.error(error);
      setAppliedCoupon(null);
      if (!isLoggedIn) {
        clearLocalCoupon();
      }

      toast.error("Invalid coupon code", {
        description:
          error instanceof Error
            ? error.message
            : "The coupon code is not valid",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);

    if (!isLoggedIn) {
      clearLocalCoupon();
    } else {
      serverRevalidate("/cart");
      serverRevalidate("/checkout");
    }

    toast.success("Coupon removed");
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
    appliedCoupon,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotals,
    getDiscountedPrice,
  };
}
