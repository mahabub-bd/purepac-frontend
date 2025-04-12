import { CategoryList } from "@/components/admin/category/category-list";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
      <CategoryList />
    </div>
  );
}
