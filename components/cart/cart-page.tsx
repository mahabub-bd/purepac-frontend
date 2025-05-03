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
      if (product.discountType === "fixed") {
        return product.sellingPrice - product.discountValue;
      } else {
        return product.sellingPrice * (1 - product.discountValue / 100);
      }
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
      // Simulate API call - replace with actual coupon validation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (couponCode.toUpperCase() === "SAVE10") {
        const couponDiscount = discountedSubtotal * 0.1;
        setAppliedCoupon({ code: couponCode, discount: couponDiscount });
        toast.success("Coupon applied successfully");
      } else {
        throw new Error("Invalid coupon code");
      }
    } catch (error) {
      console.error(error);
      setAppliedCoupon(null);
      toast.error("Invalid coupon code", {
        description: "The coupon code you entered is not valid",
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
        description: "All items have been removed from your cart",
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
    <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 md:py-10 py-5">
      {/* Main Cart Content */}
      <div className="flex flex-col md:col-span-2 rounded-lg border p-6 shadow-sm">
        {/* Cart Header */}
        <div className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              <h1 className="text-lg font-semibold">Shopping Cart</h1>
              <span className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            {itemCount > 0 && (
              <button
                onClick={handleRemoveAll}
                disabled={isRemovingAll}
                className="text-sm underline underline-offset-4 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRemovingAll ? "Removing..." : "Remove All"}
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 ">
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

      {/* Sidebar Summary */}
      {itemCount > 0 && (
        <div className="md:col-span-1">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

            {/* Coupon Section */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isApplyingCoupon || !!appliedCoupon}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !!appliedCoupon}
                  className="whitespace-nowrap"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="text-sm text-green-600">
                  Coupon {appliedCoupon.code} applied (-
                  {formatCurrencyEnglish(appliedCoupon.discount)})
                </div>
              )}
            </div>

            {/* Order Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Original Subtotal</span>
                <span>{formatCurrencyEnglish(originalSubtotal)}</span>
              </div>

              {productDiscounts > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Product Discounts</span>
                  <span>-{formatCurrencyEnglish(productDiscounts)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrencyEnglish(appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sm text-muted-foreground">
                  <Link href="/shipping" className="hover:underline">
                    Calculate shipping
                  </Link>
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 font-medium">
                <span>Total</span>
                <span>{formatCurrencyEnglish(total)}</span>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
