import { Category } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug || category.id}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50"
    >
      {/* Image Container - LCP Element */}
      <div className="p-2 xs:p-3 sm:p-4 flex justify-center items-center h-[120px] xs:h-[140px] sm:h-[160px]">
        <Image
          src={category?.attachment?.url || "/category-placeholder.svg"}
          alt={category?.name || "Product category"}
          width={600}
          height={600}
          className="object-contain w-[60px] xs:w-[80px] sm:w-[100px] transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 100px"
          priority={true}
          loading="eager"
        />
      </div>

      {/* Category Name */}
      <div className="p-2 xs:p-3 sm:p-4 text-center border-t border-gray-100">
        <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 h-[40px] flex items-center justify-center">
          {category?.name}
        </h3>
      </div>
    </Link>
  );
}
