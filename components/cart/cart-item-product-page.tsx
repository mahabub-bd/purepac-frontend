"use client";

import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/cart-context";
import { formatCurrencyEnglish } from "@/lib/utils";
import type { CartItem } from "@/utils/types";

export function CartItemProductPage({ item }: { item: CartItem }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const { updateItemQuantity, removeItem, getDiscountedPrice } =
    useCartContext();

  const now = new Date();
  const discountStart = new Date(item.product?.discountStartDate || 0);
  const discountEnd = new Date(item.product?.discountEndDate || 0);
  const hasActiveDiscount =
    item.product.discountType &&
    item.product.discountValue &&
    now >= discountStart &&
    now <= discountEnd;

  const discountedPrice = getDiscountedPrice(item.product);
  const discountAmount = item.product.sellingPrice - discountedPrice;
  let originalPriceDisplay = null;

  if (hasActiveDiscount) {
    originalPriceDisplay = (
      <span className="line-through text-muted-foreground text-sm">
        {formatCurrencyEnglish(item.product.sellingPrice)}
      </span>
    );
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === localQuantity) return;
    if (isUpdating) return;

    const previousQuantity = localQuantity;
    setLocalQuantity(newQuantity);
    setIsUpdating(true);

    try {
      await updateItemQuantity(item.id || item.product.id, newQuantity);
    } catch (error) {
      console.error(error);
      setLocalQuantity(previousQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => handleUpdateQuantity(localQuantity + 1);
  const handleDecrement = () => handleUpdateQuantity(localQuantity - 1);

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await removeItem(item.id || item.product.id);
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-start gap-4 border-b pb-6">
      <div className="aspect-square w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={item.product.attachment?.url || "/placeholder.svg"}
          alt={item.product.name}
          width={200}
          height={200}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{item.product.name}</h3>
            <div className="flex items-center gap-2">
              {originalPriceDisplay}
              <span className="text-sm font-medium">
                {formatCurrencyEnglish(discountedPrice)}
              </span>
              {hasActiveDiscount && (
                <span className="text-xs text-green-600">
                  (Save {formatCurrencyEnglish(discountAmount)})
                </span>
              )}
            </div>
          </div>
          <p className="font-medium">
            {formatCurrencyEnglish(discountedPrice * localQuantity)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
                disabled={isUpdating || localQuantity === 1}
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-6 text-center">
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mx-auto animate-spin" />
                ) : (
                  localQuantity
                )}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrement}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-8 text-sm text-muted-foreground hover:text-destructive disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-1 h-4 w-4" />
            )}
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
}
