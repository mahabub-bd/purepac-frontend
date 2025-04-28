"use client";

import { PurchaseForm } from "@/components/admin/purchase/purchase-form";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";
import type { Purchase } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPurchasePage() {
  const params = useParams();
  const purchaseId = params.id as string;

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchase = async () => {
    try {
      const response = await fetchData<Purchase>(`purchases/${purchaseId}`);
      setPurchase(response);
    } catch (error) {
      console.error("Error fetching purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [purchaseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Purchase not found</p>
      </div>
    );
  }

  return (
    <div className="md:p-6 p-2 space-y-6 border rounded-sm">
      <div className="md:p-6 p-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle>Edit Purchase</CardTitle>
            <CardDescription>Update the purchase information.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/purchase/purchase-list">Back to Purchases</Link>
          </Button>
        </div>
      </div>

      <PurchaseForm mode="edit" purchase={purchase} />
    </div>
  );
}