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
import Link from "next/link";

export default function AddCategoryPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>
                Create a new category. Fill in all the required information.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Back to Categories</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
