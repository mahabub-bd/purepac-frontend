"use client";


import { CategoryForm } from "@/components/admin/category/category-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";
import type { Category } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const response = await fetchData<Category>(`categories/${categoryId}`);
      setCategory(response);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Edit Category</CardTitle>
              <CardDescription>
                Update the category information.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Back to Categories</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryForm mode="edit" category={category} />
        </CardContent>
      </Card>
    </div>
  );
}
