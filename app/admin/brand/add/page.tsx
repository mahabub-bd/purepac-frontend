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
import Link from "next/link";

export default function AddBrandPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Add New Brand</CardTitle>
              <CardDescription>
                Create a new brand. Fill in all the required information.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/brands">Back to Brands</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BrandForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
