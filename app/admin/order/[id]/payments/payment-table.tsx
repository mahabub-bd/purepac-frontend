"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrencyEnglish, formatDateTime } from "@/lib/utils";

interface Payment {
  id: number;
  paymentNumber: string;
  amount: string;
  paymentDate: string;
  sslPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod: {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    description: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
}

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const renderPaymentRow = (payment: Payment) => (
    <TableRow key={payment.id}>
      <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
      <TableCell className="font-medium">
        {formatCurrencyEnglish(Number.parseFloat(payment.amount))}
      </TableCell>
      <TableCell>{formatDateTime(payment.paymentDate)}</TableCell>
      <TableCell>{payment.paymentMethod?.name || "N/A"}</TableCell>
      <TableCell>{payment.sslPaymentId || "-"}</TableCell>
      <TableCell>{payment.createdBy?.name || "System"}</TableCell>
      <TableCell>
        <StatusBadge status="completed" />
      </TableCell>
    </TableRow>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const statusVariant: Record<string, { bg: string; text: string }> = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-800",
      },
      default: {
        bg: "bg-gray-100",
        text: "text-gray-800",
      },
    };

    const variant = statusVariant[status] || statusVariant.default;

    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs capitalize",
          variant.bg,
          variant.text
        )}
      >
        {status}
      </span>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment #</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Paid By</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments?.length > 0 ? (
          payments.map(renderPaymentRow)
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No payments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
