import { fetchData } from "@/utils/api-utils";
import { Category } from "@/utils/types";
import { CategoryCard } from "./category-card";

export default async function CategoriesList() {
  const categories: Category[] = await fetchData("categories");
  return (
    <div className="md:py-10 py-5 container mx-auto md:px-0 px-2">
      <h1 className="mb-8 text-3xl font-bold text-center">Shop by Category</h1>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category: Category) => (
          <CategoryCard key={category?.id} category={category} />
        ))}
      </div>
    </div>
  );
}
