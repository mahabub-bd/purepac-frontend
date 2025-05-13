"use client";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of the middle section
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the beginning
      if (page <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="overflow-x-auto md:p-6 p-2 rounded-lg border">
      {loading && (
        <div className="py-4 text-center text-muted-foreground">Loading...</div>
      )}
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

      {totalOrders > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) =>
                pageNumber === "ellipsis-start" ||
                pageNumber === "ellipsis-end" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink
                      onClick={() => handlePageChange(Number(pageNumber))}
                      isActive={page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
