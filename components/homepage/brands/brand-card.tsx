// components/brand-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brand } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="relative group text-center transition-all duration-300 bg-white border border-gray-100 p-4 flex flex-col justify-between items-center rounded-xl h-full shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20">
      <Link
        href={`/brands/${brand.slug || brand.id}`}
        className="flex flex-col justify-between items-center w-full h-full"
      >
        {/* Image with subtle scale effect */}
        <div className="w-[145px] h-[145px] relative group-hover:scale-105 transition-transform duration-300">
          <Image
            src={brand?.attachment?.url || "/placeholder.svg"}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain transition-opacity duration-300 opacity-90 hover:opacity-100"
            quality={85}
          />
        </div>

        {/* Status badge with better positioning */}
        {!brand.isActive && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 px-2 py-1 text-xs font-medium"
          >
            Inactive
          </Badge>
        )}

        {/* Brand name with better typography */}
        <div className="mt-4 w-full px-2">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
            {brand.name}
          </h3>
        </div>

        {/* Product count with icon */}
        <div className="flex items-center justify-center my-3">
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary/50"></span>
            {brand.products?.length || 0} products
          </p>
        </div>
      </Link>

      {/* Button with improved styling */}
      <Button
        size="sm"
        variant="outline"
        className="font-medium text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary/90 rounded-lg py-2 px-4 transition-colors duration-300 w-full mt-auto"
      >
        Browse Collection
      </Button>
    </div>
  );
}
