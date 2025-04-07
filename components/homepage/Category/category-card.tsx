import { Category } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={"/"} className="group block">
      <div className="overflow-hidden  transition-all duration-200 ">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={category?.attachment?.url || "/placeholder.svg"}
            alt={category?.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-full "
          />
        </div>
        <div className="p-5">
          <h3 className="text-md font-semibold mb-2 group-hover:text-primary transition-colors text-center">
            {category?.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
