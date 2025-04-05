import { fetchData } from "@/utils/api-utils";
import { Category } from "@/utils/types";
import { CategoryCard } from "./category-card";

export default async function CategoriesList() {
  const categories: Category[] = await fetchData("categories");
  return (
    <section className="py-12 container mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Shop by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        {categories.map((category: Category) => (
          <CategoryCard key={category?.id} category={category} />
        ))}
      </div>
    </section>
  );
}
