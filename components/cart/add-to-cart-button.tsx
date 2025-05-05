"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/cart-context";
import type { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({
  product,
  disabled,
}: {
  product: Product;
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCartContext();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addItem(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="font-semibold text-[10px] xs:text-xs sm:text-sm border-primary text-primary hover:bg-primary/10 rounded h-8 xs:h-7 sm:h-8 cursor-pointer"
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Adding...
        </span>
      ) : (
        <>
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add
          <span className="hidden xs:inline"> to Cart</span>
        </>
      )}
    </Button>
  );
}
