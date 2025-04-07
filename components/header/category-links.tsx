"use client";

import { fetchData } from "@/utils/api-utils";
import { Category } from "@/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryLinksProps {
  onClick?: () => void;
}

const CategoryLinks: React.FC<CategoryLinksProps> = ({ onClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data: Category[] = await fetchData("categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (!categories.length) return <div>No categories found</div>;

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug || category.id}`}
          className="block text-base font-medium transition-colors hover:text-primary "
          onClick={onClick}
        >
          {category.name}
        </Link>
      ))}
    </>
  );
};

export default CategoryLinks;
