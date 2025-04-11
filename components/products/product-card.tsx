"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative group text-center duration-300 bg-white bg-opacity-25 p-4 flex flex-col justify-between items-center rounded-xl h-full shadow-md hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col justify-between items-center w-full"
      >
        <div className="w-[145px] h-[145px] relative group">
          <Image
            src={
              product?.attachment.url || "/placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain transition-transform duration-300"
          />
        </div>
        {product?.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
        {product.stock && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            In Stock
          </Badge>
        )}

        <p className="font-semibold text-sm mt-5 px-3 line-clamp-1">
          {product.name}
        </p>

        <div className="flex items-center justify-center my-2">
          <p className="font-semibold group-hover:text-primary duration-300">
            {formatCurrencyEnglish(product?.unitprice)}
          </p>
          {product.unitprice && (
            <del className="font-medium ml-2 text-xs text-gray-500">
              {formatCurrencyEnglish(product.unitprice)}
            </del>
          )}
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2 w-full mt-2">
        <Button
          size="sm"
          className="font-semibold text-xs bg-primary hover:bg-primary/90 rounded py-1 px-2 text-white duration-300"
          disabled={!product?.stock}
        >
          Buy Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="font-semibold text-xs border-primary text-primary hover:bg-primary/10 rounded py-1 px-2 duration-300"
          disabled={!product?.stock}
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
