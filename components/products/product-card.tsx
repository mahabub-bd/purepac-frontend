import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { getBlurData } from "@/utils/blur-generator";
import { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProductCard({ product }: { product: Product }) {
  const { base64 } = await getBlurData(product?.attachment?.url);
  return (
    <div className="relative group text-center transition-all duration-300 bg-white bg-opacity-25 p-3 sm:p-4 flex flex-col justify-between items-center rounded-xl h-full shadow-sm hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col justify-between items-center w-full h-full"
      >
        {/* Image Container */}
        <div className="w-[100px] h-[100px] xs:w-[120px] xs:h-[120px] sm:w-[140px] sm:h-[140px] md:w-[145px] md:h-[145px] relative">
          {product?.attachment?.url && (
            <Image
              src={product?.attachment?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 140px, 145px"
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
        <p className="font-semibold text-xs sm:text-sm mt-3 sm:mt-4 px-2 line-clamp-2  flex items-center">
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-center justify-center my-1 sm:my-2">
          <p className="font-semibold text-sm sm:text-md group-hover:text-primary transition-colors">
            {formatCurrencyEnglish(product?.unitprice)}
          </p>
          {product.unitprice && (
            <del className="font-medium ml-2 text-[10px] sm:text-xs text-gray-500">
              {formatCurrencyEnglish(product.unitprice)}
            </del>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full mt-2 sm:mt-3">
        <Button
          size="sm"
          className="font-semibold text-[10px] xs:text-xs sm:text-sm bg-primary hover:bg-primary/90 rounded h-8 xs:h-9"
          disabled={!product?.stock}
        >
          Buy Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="font-semibold text-[10px] xs:text-xs sm:text-sm border-primary text-primary hover:bg-primary/10 rounded h-8 xs:h-9"
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
