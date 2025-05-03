"use client";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import { deleteData } from "@/utils/api-utils";
import { serverRevalidate } from "@/utils/revalidatePath";
import { Cart, CartItem, Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CartItemProduct } from "./cart-item";
import { EmptyCart } from "./empty-cart";

export function CartButtonHeader({
  cart,
  compact,
}: {
  cart?: Cart;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

      // Example coupon logic (10% discount)
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
      serverRevalidate("/cart");
      toast.success("Cart cleared", {
        description: "All items have been removed from your cart",
      });
      setIsOpen(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <IconButton
          aria-label="Open cart"
          icon={
            <ShoppingCart
              className={cn(
                "text-foreground/80 transition-colors hover:text-primary",
                compact ? "size-4" : "size-5"
              )}
            />
          }
          label={compact ? "" : "Cart"}
          count={itemCount}
          alwaysShowCount
        />
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "flex h-full flex-col p-0 sm:p-4 md:p-6",
          "w-full sm:max-w-md md:max-w-xl lg:max-w-2xl"
        )}
      >
        <SheetHeader className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                <span>Shopping Cart</span>
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </SheetTitle>
            {itemCount > 0 && (
              <button
                onClick={handleRemoveAll}
                disabled={isRemovingAll}
                className="text-sm underline underline-offset-4 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isRemovingAll ? "Removing..." : "Remove All"}
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {itemCount > 0 ? (
            <div className="space-y-6">
              {cart &&
                cart.items.map((item: CartItem) => (
                  <CartItemProduct key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <EmptyCart onClose={() => setIsOpen(false)} />
          )}
        </div>

        {itemCount > 0 && (
          <SheetFooter className="border-t p-4 md:p-6">
            <div className="w-full space-y-4">
              {/* Coupon Section */}
              <div className="space-y-2">
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

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal</span>
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
                    <span>
                      -{formatCurrencyEnglish(appliedCoupon.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>{formatCurrencyEnglish(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    View Cart
                  </Link>
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
