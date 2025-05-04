"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyEnglish } from "@/lib/utils";
import { deleteData } from "@/utils/api-utils";
import { serverRevalidate } from "@/utils/revalidatePath";
import { Cart, CartItem, Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CartItemProductPage } from "./cart-item-product-page";
import { EmptyCart } from "./empty-cart";

export function CartPage({ cart }: { cart?: Cart }) {
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

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

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const originalSubtotal =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.sellingPrice * item.quantity,
      0
    ) || 0;
  const discountedSubtotal =
    cart?.items?.reduce(
      (sum, item) => sum + getDiscountedPrice(item.product) * item.quantity,
      0
    ) || 0;
  const productDiscounts = originalSubtotal - discountedSubtotal;
  const total = discountedSubtotal - (appliedCoupon?.discount || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (couponCode.toUpperCase() === "SAVE10") {
        const couponDiscount = discountedSubtotal * 0.1;
        setAppliedCoupon({ code: couponCode, discount: couponDiscount });
        toast.success("Coupon applied successfully");
      } else throw new Error("Invalid coupon code");
    } catch (error) {
      console.error(error);
      setAppliedCoupon(null);
      toast.error("Invalid coupon code", {
        description: "The coupon code is not valid",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveAll = async () => {
    if (!cart?.items?.length) return;
    setIsRemovingAll(true);
    try {
      await deleteData("cart", "");
      serverRevalidate("/");
      toast.success("Cart cleared", {
        description: "All items removed from your cart",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
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
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
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
                variant="outline"
                onClick={handleRemoveAll}
                disabled={isRemovingAll}
                className="text-sm text-destructive underline-offset-4 hover:underline disabled:opacity-50 sm:self-end cursor-pointer"
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
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isApplyingCoupon || !!appliedCoupon}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !!appliedCoupon}
                  className="w-full sm:w-auto"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="text-sm text-green-600">
                  Applied {appliedCoupon.code} (-
                  {formatCurrencyEnglish(appliedCoupon.discount)})
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

              <div className="flex justify-between border-t pt-4 text-base font-medium sm:text-lg">
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
