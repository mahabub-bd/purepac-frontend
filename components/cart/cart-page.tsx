"use client";

import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/contexts/cart-context";
import { applyCoupon, validateCoupon } from "@/lib/coupon-service";
import { formatCurrencyEnglish } from "@/lib/utils";
import type { Cart, CartItem } from "@/utils/types";
import { CartItemProductPage } from "./cart-item-product-page";
import { EmptyCart } from "./empty-cart";

export function CartPage({ cart }: { cart?: Cart }) {
  const { clearCart, getCartTotals } = useCartContext();
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const { itemCount, originalSubtotal, discountedSubtotal, productDiscounts } =
    getCartTotals();
  const total = discountedSubtotal - (appliedCoupon?.discount || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
     
      const validationRes = await validateCoupon(couponCode);
      if (validationRes.statusCode !== 200) {
        throw new Error(validationRes.message || "Coupon validation failed");
      }

      const applyRes = await applyCoupon(couponCode, discountedSubtotal);

      if (applyRes.statusCode === 200 && applyRes.data) {
        setAppliedCoupon({
          code: couponCode,
          discount: applyRes.data.discountValue,
        });
        toast.success("Coupon applied successfully");
      } else {
        throw new Error(applyRes.message || "Failed to apply coupon");
      }
    } catch (error:unknown) {
      console.error(error);
      setAppliedCoupon(null);
      toast.error("Invalid coupon code", {
        description: error instanceof Error ? error.message : "The coupon code is not valid",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleRemoveAll = async () => {
    if (!cart?.items?.length) return;
    setIsRemovingAll(true);
    try {
      await clearCart();
      toast.success("Cart cleared", {
        description: "All items removed from your cart",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Something went wrong",
      });
    } finally {
      setIsRemovingAll(false);
    }
  };
  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8 lg:py-8">
      {/* Main Cart Content */}
      <div className="flex flex-col rounded-lg border bg-background shadow-sm lg:col-span-2">
        {/* Cart Header */}
        <div className="border-b p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <h1 className="text-lg font-semibold">Shopping Cart</h1>
                <span className="text-sm text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </div>
            </div>
            {itemCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveAll}
                disabled={isRemovingAll}
                className="text-muted-foreground hover:text-destructive disabled:opacity-50"
              >
                {isRemovingAll ? "Clearing..." : "Clear Cart"}
              </Button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {itemCount > 0 ? (
            <div className="space-y-6">
              {cart?.items.map((item: CartItem) => (
                <CartItemProductPage key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>
      </div>

      {/* Order Summary */}
      {itemCount > 0 && (
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

            {/* Coupon Section */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon || !!appliedCoupon}
                    className={
                      appliedCoupon
                        ? "border-green-500 bg-green-50/50 pr-8"
                        : ""
                    }
                  />
                  {appliedCoupon && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove coupon</span>
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleApplyCoupon}
                  disabled={
                    isApplyingCoupon || !!appliedCoupon || !couponCode.trim()
                  }
                  className="w-full sm:w-auto"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center text-sm text-green-600">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200 mr-2"
                  >
                    {appliedCoupon.code.toUpperCase()}
                  </Badge>
                  <span>
                    {formatCurrencyEnglish(appliedCoupon.discount)} discount
                    applied
                  </span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal:</span>
                <span>{formatCurrencyEnglish(originalSubtotal)}</span>
              </div>

              {productDiscounts > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Product Discounts:</span>
                  <span>-{formatCurrencyEnglish(productDiscounts)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount:</span>
                  <span>-{formatCurrencyEnglish(appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <span className="text-sm text-muted-foreground">Shipping:</span>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Calculate shipping
                </Link>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between pt-2 text-base font-medium sm:text-lg">
                <span>Total:</span>
                <span>{formatCurrencyEnglish(total)}</span>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
