"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrencyEnglish } from "@/lib/utils";
import { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={
              product?.attachment.url || "/placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
        {product?.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
        {product.stock && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            In Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product?.category?.name}
          </Badge>
        </div>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="font-bold text-md">
          {formatCurrencyEnglish(product?.unitprice)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full cursor-pointer" disabled={!product?.stock}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
