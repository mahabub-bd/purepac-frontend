"use client";
import { PaginationComponent } from "@/components/common/pagination";
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
import { type Order, OrderStatus, type PaginatedResponse } from "@/utils/types";

import { Edit, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../loading-indicator";

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

  const totalPages = Math.ceil(totalOrders / limit);

  const getOrderRange = () => {
    if (totalOrders === 0) return { start: 0, end: 0 };

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalOrders);

    return { start, end };
  };

  const { start, end } = getOrderRange();

  return (
    <div className="overflow-x-auto md:p-6 p-2 rounded-lg border">
      {loading && <LoadingIndicator message="Loading Orders..... " />}
      {error && <div className="py-4 text-center text-red-500">{error}</div>}

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
          {orders.length === 0 && !loading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.user.mobileNumber}</TableCell>
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                <TableCell>
                  {formatCurrencyEnglish(order?.totalValue)}
                </TableCell>
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
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground ">
          {start} to {end} of {totalOrders} Orders
        </div>
        {totalOrders > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <PaginationComponent
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
