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

// Order type with phone number
type Order = {
  id: string;
  customer: string;
  phone: string;
  date: string;
  amount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
};

// Sample data with phone numbers
const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "01710000001",
    date: "2025-05-01",
    amount: 120.5,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    phone: "01710000002",
    date: "2025-05-03",
    amount: 89.99,
    status: "Pending",
  },
  {
    id: "ORD-003",
    customer: "Alice Johnson",
    phone: "01710000003",
    date: "2025-05-05",
    amount: 99.0,
    status: "Shipped",
  },
  {
    id: "ORD-004",
    customer: "Md. Rakib Hossain",
    phone: "01812345678",
    date: "2025-05-06",
    amount: 150.0,
    status: "Delivered",
  },
  {
    id: "ORD-005",
    customer: "Nasima Akter",
    phone: "01987654321",
    date: "2025-05-07",
    amount: 75.25,
    status: "Pending",
  },
  {
    id: "ORD-006",
    customer: "Shahidul Islam",
    phone: "01611112222",
    date: "2025-05-07",
    amount: 210.75,
    status: "Cancelled",
  },
  {
    id: "ORD-007",
    customer: "Ayesha Sultana",
    phone: "01555556666",
    date: "2025-05-08",
    amount: 180.0,
    status: "Shipped",
  },
  {
    id: "ORD-008",
    customer: "Mizanur Rahman",
    phone: "01333334444",
    date: "2025-05-08",
    amount: 99.99,
    status: "Delivered",
  },
];

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "Pending":
      return "⏳";
    case "Shipped":
      return "🚚";
    case "Delivered":
      return "✅";
    case "Cancelled":
      return "❌";
    default:
      return "";
  }
};

export default function OrdersTable() {
  return (
    <div className="overflow-x-auto md:p-6 p-2 rounded-lg border">
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
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>৳{order.amount.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    order.status === "Pending"
                      ? "text-yellow-500"
                      : order.status === "Shipped"
                      ? "text-blue-500"
                      : order.status === "Delivered"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
