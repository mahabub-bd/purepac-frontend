"use client";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import { Cart, CartItem } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartItemProduct } from "../cart/cart-item";
import { EmptyCart } from "../cart/empty-cart";

export function CartButton({
  cart,
  compact,
}: {
  cart?: Cart;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.sellingPrice * item.quantity,
      0
    ) || 0;

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
          <SheetTitle className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              <span>Shopping Cart</span>
            </div>
            <span className="text-sm font-normal text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {itemCount > 0 ? (
            <div className="space-y-6">
              {cart &&
                cart.items.map((item: CartItem) => (
                  <CartItemProduct
                    key={item.id}
                    item={item}
                    onRemove={() => console.log("Remove item")}
                  />
                ))}
            </div>
          ) : (
            <EmptyCart onClose={() => setIsOpen(false)} />
          )}
        </div>

        {itemCount > 0 && (
          <SheetFooter className="border-t p-4 md:p-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-base font-medium">
                <span>Subtotal</span>
                {formatCurrencyEnglish(Number(total.toFixed(2)))}
              </div>

              <div className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
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
