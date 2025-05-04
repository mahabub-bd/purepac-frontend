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
      serverRevalidate("/cart");
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
            <ShoppingCart
              className={cn(
                "text-foreground/80 hover:text-primary",
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
        className="flex h-full flex-col p-0 w-full sm:max-w-md lg:max-w-2xl"
      >
        <SheetHeader className="border-b p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-baseline gap-4 max-w-[100%]">
              <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                <ShoppingCart className="size-6 sm:size-7" />
                <span className="truncate">Shopping Cart</span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {itemCount > 0 ? (
            cart?.items.map((item: CartItem) => (
              <CartItemProduct key={item.id} item={item} />
            ))
          ) : (
            <EmptyCart onClose={() => setIsOpen(false)} />
          )}
        </div>
        {itemCount > 0 && (
          <div className="sm:ml-4 lg:ml-8 mt-4 sm:mt-2">
            <button
              onClick={handleRemoveAll}
              disabled={isRemovingAll}
              className="text-sm sm:text-base text-destructive hover:text-destructive/80 underline underline-offset-4 disabled:opacity-50 whitespace-nowrap"
            >
              {isRemovingAll ? "Clearing..." : "Clear Cart"}
            </button>
          </div>
        )}
        {itemCount > 0 && (
          <SheetFooter className="border-t p-4 sm:p-6">
            <div className="w-full space-y-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon || !!appliedCoupon}
                    className="flex-1 min-w-[200px]"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !!appliedCoupon}
                    size="sm"
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="text-sm sm:text-base text-green-600">
                    Applied {appliedCoupon.code} (-
                    {formatCurrencyEnglish(appliedCoupon.discount)})
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-base sm:text-lg">
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
                    <span>
                      -{formatCurrencyEnglish(appliedCoupon.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base text-muted-foreground pt-2">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg sm:text-xl font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrencyEnglish(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  asChild
                  size="sm"
                  className="w-full text-base sm:text-base"
                >
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="whitespace-nowrap"
                  >
                    Checkout
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-base sm:text-base"
                >
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="whitespace-nowrap"
                  >
                    Detailed Cart
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
