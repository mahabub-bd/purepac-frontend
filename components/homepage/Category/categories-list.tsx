import { fetchData } from "@/utils/api-utils";
import { Category } from "@/utils/types";
import { CategoryCard } from "./category-card";

export default async function CategoriesList({
  children,
  endpoint,
}: {
  children: React.ReactNode;
  endpoint: string;
}) {
  const categories: Category[] = await fetchData(endpoint);

  return (
    <div className="container mx-auto py-5 px-4 sm:px-6 md:py-10 md:px-0">
      {children}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
        {categories?.map((category: Category) => (
          <CategoryCard key={category?.id} category={category} />
        ))}
      </div>
    </div>
  );
}
