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
    <div className="md:py-10 py-5 container mx-auto md:px-0 px-2">
      {children}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories?.map((category: Category) => (
          <CategoryCard key={category?.id} category={category} />
        ))}
      </div>
    </div>
  );
}
