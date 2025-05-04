"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { deleteData, patchData } from "@/utils/api-utils";
import { serverRevalidate } from "@/utils/revalidatePath";
import type { CartItem } from "@/utils/types";

export function CartItemProductPage({ item }: { item: CartItem }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Discount calculations
  const now = new Date();
  const discountStart = new Date(item.product?.discountStartDate || 0);
  const discountEnd = new Date(item.product?.discountEndDate || 0);
  const hasActiveDiscount =
    item.product.discountType &&
    item.product.discountValue &&
    now >= discountStart &&
    now <= discountEnd;

  let discountedPrice = item.product.sellingPrice;
  let discountAmount = 0;
  let originalPriceDisplay = null;

  if (hasActiveDiscount) {
    if (item.product.discountType === "fixed") {
      discountAmount = item.product.discountValue ?? 0;
      discountedPrice = item.product.sellingPrice - discountAmount;
    } else {
      discountAmount =
        (item.product.sellingPrice * (item.product.discountValue ?? 0)) / 100;
      discountedPrice = item.product.sellingPrice - discountAmount;
    }

    originalPriceDisplay = (
      <span className="line-through text-muted-foreground text-sm">
        {formatCurrencyEnglish(item.product.sellingPrice)}
      </span>
    );
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      setLocalQuantity(newQuantity);
      await patchData(`cart/items/${item.id}`, { quantity: newQuantity });
      serverRevalidate("/");
      serverRevalidate("/cart");
    } catch (error) {
      setLocalQuantity(item.quantity);
      toast.error(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => handleUpdateQuantity(localQuantity + 1);
  const handleDecrement = () => handleUpdateQuantity(localQuantity - 1);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await deleteData(`cart/items`, item.id);
      toast.success("Item removed", {
        description: `${item.product.name} has been removed from your cart`,
      });
      serverRevalidate("/");
      serverRevalidate("/cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
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
              <span className="w-6 text-center">{localQuantity}</span>
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
            <Trash2 className="mr-1 h-4 w-4" />
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
}
