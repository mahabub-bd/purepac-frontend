"use client";

import { useCartContext } from "@/contexts/cart-context";
import { formatCurrencyEnglish } from "@/lib/utils";
import type { CartItem } from "@/utils/types";
import { Loader2, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function CartItemProduct({ item }: { item: CartItem }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const { updateItemQuantity, removeItem, getDiscountedPrice } =
    useCartContext();

  // Item ID could be either the server-side ID or the product ID for local storage items
  const itemId = item.id || item.product.id;

  // // Discount calculations
  // const now = new Date();
  // const discountStart = new Date(item.product?.discountStartDate || 0);
  // const discountEnd = new Date(item.product?.discountEndDate || 0);
  // const hasActiveDiscount =
  //   item.product.discountType &&
  //   item.product.discountValue &&
  //   now >= discountStart &&
  //   now <= discountEnd;

  const discountedPrice = getDiscountedPrice(item.product);
  const hasDiscount = discountedPrice < item.product.sellingPrice;
  const totalPrice = discountedPrice * localQuantity;

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (isUpdating) return;

    const previousQuantity = localQuantity;
    setLocalQuantity(newQuantity);
    setIsUpdating(true);

    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (error) {
      console.error(error);
      setLocalQuantity(previousQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.product.attachment?.url || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium line-clamp-1">
            {item.product.name}
          </h3>
          <button
            onClick={handleRemoveItem}
            disabled={isRemoving}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
          >
            {isRemoving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleUpdateQuantity(localQuantity - 1)}
              disabled={isUpdating || localQuantity <= 1}
              className="h-5 w-5 rounded-full border flex items-center justify-center text-xs disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs w-5 text-center">
              {isUpdating ? (
                <Loader2 className="h-3 w-3 mx-auto animate-spin" />
              ) : (
                localQuantity
              )}
            </span>
            <button
              onClick={() => handleUpdateQuantity(localQuantity + 1)}
              disabled={isUpdating || localQuantity >= 99}
              className="h-5 w-5 rounded-full border flex items-center justify-center text-xs disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">
              {formatCurrencyEnglish(totalPrice)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                {formatCurrencyEnglish(
                  item.product.sellingPrice * localQuantity
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
