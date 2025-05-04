"use client";

import { formatCurrencyEnglish } from "@/lib/utils";
import { deleteData, patchData } from "@/utils/api-utils";
import { serverRevalidate } from "@/utils/revalidatePath";
import type { CartItem } from "@/utils/types";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function CartItemProduct({ item }: { item: CartItem }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const getDiscountedPrice = () => {
    const product = item.product;
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

  const hasDiscount = getDiscountedPrice() < item.product.sellingPrice;
  const discountedPrice = getDiscountedPrice();
  const totalPrice = discountedPrice * item.quantity;

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await patchData(`cart/items/${item.id}`, { quantity: newQuantity });
      serverRevalidate("/");
      serverRevalidate("/cart");
    } catch (error) {
      console.error(error);
      toast.error("Error updating quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await deleteData(`cart/items/${item.id}`, "");
      serverRevalidate("/");
      serverRevalidate("/cart");
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Error removing item");
    } finally {
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
            onClick={removeItem}
            disabled={isRemoving}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateQuantity(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="h-5 w-5 rounded-full border flex items-center justify-center text-xs disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs w-5 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= 99}
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
                  item.product.sellingPrice * item.quantity
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
