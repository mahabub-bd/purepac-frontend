import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

const orders = [
  {
    id: "1001",
    customer: "John Doe",
    date: "Apr 3, 2023",
    status: "Completed",
    amount: "125.99",
  },
  {
    id: "1002",
    customer: "Jane Smith",
    date: "Apr 2, 2023",
    status: "Processing",
    amount: "89.50",
  },
  {
    id: "1003",
    customer: "Robert Johnson",
    date: "Apr 2, 2023",
    status: "Completed",
    amount: "245.00",
  },
  {
    id: "1004",
    customer: "Emily Davis",
    date: "Apr 1, 2023",
    status: "Processing",
    amount: "32.75",
  },
  {
    id: "1005",
    customer: "Michael Wilson",
    date: "Mar 31, 2023",
    status: "Cancelled",
    amount: "149.99",
  },
  {
    id: "1006",
    customer: "Sarah Taylor",
    date: "Mar 30, 2023",
    status: "Completed",
    amount: "55.25",
  },
  {
    id: "1007",
    customer: "David Brown",
    date: "Mar 29, 2023",
    status: "Processing",
    amount: "78.50",
  },
  {
    id: "1008",
    customer: "Lisa Anderson",
    date: "Mar 28, 2023",
    status: "Completed",
    amount: "214.30",
  },
];
