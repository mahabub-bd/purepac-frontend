"use client";

import { ProductForm } from "@/components/admin/products/product-form";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/utils/api-utils";
import type { Brand, Category } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AddProductPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const response = await fetchData<Brand[]>("brands");
      if (Array.isArray(response)) {
        setBrands(response);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchData<Category[]>("categories");
      if (Array.isArray(response)) {
        setCategories(response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBrands(), fetchCategories()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="md:p-6 p:2 space-y-6 border rouunded-sm">
      <div className=" md:p-6 p:2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <p className="text-sm text-muted-foreground">
              Create a new product. Fill in all the required information.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/products/products-list">Back to Products</Link>
          </Button>
        </div>
        <div>
          <ProductForm mode="create" brands={brands} categories={categories} />
        </div>
      </div>
    </div>
  );
}
