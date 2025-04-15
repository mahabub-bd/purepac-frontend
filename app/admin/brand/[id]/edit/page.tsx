"use client";

import { BrandForm } from "@/components/admin/brand/brand-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";
import type { Brand } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBrandPage() {
  const params = useParams();
  const brandId = params.id as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrand = async () => {
    try {
      const response = await fetchData<Brand>(`brands/${brandId}`);
      setBrand(response);
    } catch (error) {
      console.error("Error fetching brand:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [brandId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Brand not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Edit Brand</CardTitle>
              <CardDescription>Update the brand information.</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/brand">Back to Brands</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BrandForm mode="edit" brand={brand} />
        </CardContent>
      </Card>
    </div>
  );
}
