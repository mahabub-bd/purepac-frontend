import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { getBlurData } from "@/utils/blur-generator";
import type { Product } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProductCard({ product }: { product: Product }) {
  const { base64 } = await getBlurData(product?.attachment?.url);

  return (
    <div className="group relative h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Stock Badge */}
      {product?.stock === 0 ? (
        <Badge
          variant="destructive"
          className="absolute right-3 top-3 z-10 text-[10px] font-medium sm:text-xs"
        >
          Out of Stock
        </Badge>
      ) : (
        product.stock > 0 && (
          <Badge className="absolute right-3 top-3 z-10 bg-green-500 text-[10px] font-medium hover:bg-green-600 sm:text-xs">
            In Stock
          </Badge>
        )
      )}

      <Link
        href={`/products/${product.id}`}
        className="flex h-full flex-col items-center justify-between"
      >
        {/* Image Container with gradient overlay */}
        <div className="relative flex w-full items-center justify-center ">
          <div className="relative h-[130px] w-[130px] xs:h-[140px] xs:w-[140px] sm:h-[160px] sm:w-[160px] md:h-[170px] md:w-[170px] transition-transform duration-500 group-hover:scale-110">
            {product?.attachment?.url && (
              <Image
                src={product?.attachment?.url || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 130px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 170px"
                className="object-contain"
                priority={false}
                blurDataURL={base64}
                placeholder="blur"
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex w-full flex-1 flex-col justify-between p-4 pt-3">
          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-center text-sm font-semibold sm:text-base">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3 flex items-center justify-center">
            <p className="text-md font-bold text-primary transition-colors sm:text-lg">
              {formatCurrencyEnglish(product?.unitprice)}
            </p>
            {product.unitprice && (
              <del className="ml-2 text-xs font-medium text-gray-500 sm:text-sm">
                {formatCurrencyEnglish(product.unitprice)}
              </del>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              size="sm"
              className="rounded-lg font-semibold text-[10px] cursor-pointer  xs:text-xs sm:text-sm h-9 sm:h-10 bg-amber-600 hover:bg-amber-600/90"
              disabled={!product?.stock}
            >
              Buy Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-primary text-[10px] cursor-pointer font-semibold text-primary hover:bg-primary/10 xs:text-xs sm:text-sm h-9 sm:h-10"
              disabled={!product?.stock}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add
              <span className="hidden xs:inline"> to Cart</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
