"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";

import { Payment, Purchase } from "@/utils/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentsTable } from "./payment-table";

export default function PaymentsListPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const [purchase, setPurchase] = useState<
    (Purchase & { payments: Payment[] }) | null
  >(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        setLoading(true);

        const purchaseData = await fetchData<
          Purchase & { payments: Payment[] }
        >(`purchases/${purchaseId}`);
        setPurchase(purchaseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSequentially();
  }, [purchaseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading payments...</p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Purchase not found</p>
      </div>
    );
  }

  const remainingAmount =
    parseFloat(purchase.totalValue) - parseFloat(purchase.amountPaid);

  return (
    <div className="md:p-6 p-2 space-y-6 border rounded-sm">
      <div className="md:p-6 p-2">
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-1 gap-2">
            <CardTitle>
              Payments for Purchase #{purchase.purchaseNumber}
            </CardTitle>
            <CardDescription>
              Total: {purchase.totalValue} | Paid: {purchase.amountPaid} |
              Remaining: {remainingAmount.toFixed(2)}
            </CardDescription>
          </div>
          {remainingAmount > 0 && (
            <Button asChild>
              <Link href={`/admin/purchase/${purchaseId}/payment`}>
                <Plus className="mr-2 h-4 w-4" /> Add Payment
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="md:p-6 p-2">
        <PaymentsTable payments={purchase?.payments} />
      </div>
    </div>
  );
}
