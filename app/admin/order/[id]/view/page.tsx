"use client";

import OrderView from "@/components/admin/orders/order-view";
import { fetchData } from "@/utils/api-utils";
import { Order } from "@/utils/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const response = await fetchData<Order>(`orders/${orderId}`);
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Order Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <OrderView
      order={order}
      onBack={() => console.log("Back button clicked")}
    />
  );
}
