"use client";

import { LoadingIndicator } from "@/components/admin/loading-indicator";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { fetchData } from "@/utils/api-utils";
import { Order } from "@/utils/types";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentsTable } from "./payment-table";

export default function OrderPaymentsListPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("Order ID:", order);
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await fetchData<Order>(`orders/${orderId}`);
        setOrder(response);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return <LoadingIndicator message="Loading Order Payments" />;
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Order not found</p>
      </div>
    );
  }

  const remainingAmount = order.totalValue - order.paidAmount;

  return (
    <div className="w-full md:p-6 p-2 border rounded-sm">
      <div className="md:p-6 p-2">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title={`Payments for Order #${order.orderNo}`}
            description={`Total: ${formatCurrencyEnglish(
              order.totalValue
            )} | Paid: ${formatCurrencyEnglish(
              order.paidAmount
            )} | Remaining: ${formatCurrencyEnglish(remainingAmount)}`}
          />
          <Button variant="default" asChild>
            <Link href={`/admin/orders`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
              Back To Orders
            </Link>
          </Button>
          {remainingAmount > 0 && (
            <Button asChild>
              <Link href={`/admin/order/${orderId}/payment`}>
                <Plus className="mr-2 h-4 w-4" /> Add Payment
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="md:p-6 p-2">
        <PaymentsTable payments={order.payments ?? []} />
      </div>
    </div>
  );
}
