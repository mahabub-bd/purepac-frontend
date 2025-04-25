import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { formatCurrencyEnglish } from "@/lib/utils";

import { getBlurData } from "@/utils/blur-generator";
import type { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProductCard({ product }: { product: Product }) {
  const { base64 } = await getBlurData(product?.attachment?.url);
  return (
    <div className="relative group text-center transition-all duration-300 bg-white bg-opacity-25 p-4 sm:p-3 flex flex-col justify-between items-center rounded-xl min-h-[280px] xs:min-h-[300px] sm:min-h-[320px] md:min-h-[340px] shadow-lg hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col justify-between items-center w-full h-full"
      >
        {/* Image Container */}
        <div className="w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] relative my-2 sm:my-3">
          {product?.attachment?.url && (
            <Image
              src={product?.attachment?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 180px"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority={false}
              blurDataURL={base64}
              placeholder="blur"
            />
          )}
        </div>

        {/* Stock Badge */}
        {product?.stock === 0 ? (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 text-[10px] sm:text-xs"
          >
            Out of Stock
          </Badge>
        ) : (
          product.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-[10px] sm:text-xs">
              In Stock
            </Badge>
          )
        )}

        {/* Product Name */}
        <p className="font-semibold text-xs sm:text-sm mt-4 sm:mt-5 px-2 line-clamp-2 flex items-center">
          {product.name}
        </p>

        {/* Price */}
        {/* <div className="flex items-center justify-center my-2 sm:my-2 md:flex-row flex-col">
          <p className="font-semibold text-sm sm:text-md group-hover:text-primary transition-colors">
            {formatCurrencyEnglish(product?.sellingPrice)}
          </p>
          {product?.sellingPrice && (
            <div className="font-medium ml-2 text-[10px] sm:text-xs text-gray-500">
              {formatCurrencyEnglish(product?.sellingPrice)}
            </div>
          )}
        </div> */}
      </Link>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full mt-3 sm:mt-4">
        <Button
          size="sm"
          className="font-semibold text-[10px] xs:text-xs sm:text-sm bg-primary hover:bg-primary/90 rounded h-8 xs:h-7 sm:h-8"
          disabled={!product?.stock}
        >
          Buy Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="font-semibold text-[10px] xs:text-xs sm:text-sm border-primary text-primary hover:bg-primary/10 rounded h-8 xs:h-7 sm:h-8"
          disabled={!product?.stock}
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add
          <span className="hidden xs:inline"> to Cart</span>
        </Button>
      </div>
    </div>
  );
}
