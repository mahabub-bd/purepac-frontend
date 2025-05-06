"use client";

import { ShoppingBag, ShoppingCart, Tag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartContext } from "@/contexts/cart-context";
import { applyCoupon, validateCoupon } from "@/lib/coupon-service";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import type { Cart, CartItem } from "@/utils/types";
import { CartItemProduct } from "./cart-item";
import { EmptyCart } from "./empty-cart";

export function CartButtonHeader({
  cart,
  compact,
}: {
  cart?: Cart;
  compact?: boolean;
}) {
  const { clearCart, getDiscountedPrice } = useCartContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

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
      // Step 1: Validate the coupon
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
    } catch (error: unknown) {
      console.error(error);
      setAppliedCoupon(null);
      const errorMessage =
        error instanceof Error ? error.message : "The coupon code is not valid";
      toast.error("Invalid coupon code", {
        description: errorMessage,
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
      toast.success("Cart cleared");
      setIsOpen(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <IconButton
          aria-label="Open cart"
          icon={
            <ShoppingBag
              className={cn(
                "text-foreground/80 hover:text-primary transition-colors",
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
        className="flex h-full flex-col p-0 w-full sm:max-w-md lg:max-w-lg"
      >
        <SheetHeader className="border-b py-3 px-4 sm:py-4 sm:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart className="size-5" />
                <span>Your Cart</span>
                {itemCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Badge>
                )}
              </SheetTitle>
            </div>

            {itemCount > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveAll}
                  disabled={isRemovingAll}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isRemovingAll ? "Clearing..." : "Clear Cart"}
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {itemCount > 0 ? (
            <div className="divide-y">
              {cart?.items.map((item: CartItem) => (
                <div key={item.id} className="py-3 px-4 sm:py-4 sm:px-6">
                  <CartItemProduct item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <EmptyCart onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>

        {itemCount > 0 && (
          <div className="border-t">
            <div className="p-4 sm:p-6 space-y-4">
              {/* Coupon Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Apply Discount Code
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isApplyingCoupon || !!appliedCoupon}
                      className={cn(
                        "pr-8 h-9",
                        appliedCoupon && "border-green-500 bg-green-50/50"
                      )}
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
                    size="sm"
                    className="whitespace-nowrap h-9"
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="text-xs text-green-600 flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600 border-green-200 text-xs"
                    >
                      {appliedCoupon.code.toUpperCase()}
                    </Badge>
                    <span className="ml-2">
                      {formatCurrencyEnglish(appliedCoupon.discount)} discount
                      applied
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              {/* Order Summary */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
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

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium text-base pt-1">
                    <span>Total</span>
                    <span>{formatCurrencyEnglish(total)}</span>
                  </div>
                </div>
              </div>

              <SheetFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button asChild className="w-full sm:flex-1 h-9">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 h-9"
                >
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    View Cart Details
                  </Link>
                </Button>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
