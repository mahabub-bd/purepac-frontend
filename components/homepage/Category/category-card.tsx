import { Category } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug || category.id}`}
      className="group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <div className="p-2 flex justify-center items-center">
        <Image
          src={category?.attachment?.url || "/category-placeholder.svg"}
          alt={category?.name || "Product category"}
          width={80}
          height={80}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-gray-800 group-hover:text-primary transition-colors">
          {category?.name}
        </h3>
      </div>
    </Link>
  );
}
