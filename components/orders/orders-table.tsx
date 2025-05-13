"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyEnglish, formatDateTime } from "@/lib/utils";
import { fetchDataPagination } from "@/utils/api-utils";
import { Order, OrderStatus, PaginatedResponse } from "@/utils/types";

import { Edit, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const getStatusIcon = (status: Order["orderStatus"]) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "⏳";
    case OrderStatus.SHIPPED:
      return "🚚";
    case OrderStatus.DELIVERED:
      return "✅";
    case OrderStatus.CANCELLED:
      return "❌";
    default:
      return "";
  }
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const data: PaginatedResponse<Order> = await fetchDataPagination(
          `orders?page=${page}&limit=${limit}`
        );
        setOrders(data.data);
        setTotalOrders(data.total);
      } catch (err) {
        console.error(err);
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalOrders / limit)) {
      setPage(newPage);
    }
  };

  return (
    <div className="overflow-x-auto md:p-6 p-2 rounded-lg border">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNo}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{order.user.mobileNumber}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>{formatCurrencyEnglish(order?.totalValue)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    order.orderStatus === OrderStatus.PENDING
                      ? "text-yellow-500"
                      : order.orderStatus === OrderStatus.SHIPPED
                      ? "text-blue-500"
                      : order.orderStatus === OrderStatus.DELIVERED
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {getStatusIcon(order.orderStatus)} {order.orderStatus}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1" /> View
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Edit className="mr-1" /> Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          variant="outline"
          disabled={page >= Math.ceil(totalOrders / limit)}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
