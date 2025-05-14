"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyEnglish } from "@/lib/utils";
import { patchData } from "@/utils/api-utils";
import type { Order } from "@/utils/types";
import { Section } from "../helper";

// Create strict schema for admin updates
const orderUpdateSchema = z.object({
  orderStatus: z.union([
    z.literal("PENDING"),
    z.literal("PROCESSING"),
    z.literal("SHIPPED"),
    z.literal("DELIVERED"),
    z.literal("CANCELLED"),
  ]),
  paymentStatus: z.union([
    z.literal("PENDING"),
    z.literal("PAID"),
    z.literal("FAILED"),
    z.literal("REFUNDED"),
  ]),
  paidAmount: z.coerce.number().min(0, "Paid amount cannot be negative"),
});

type OrderUpdateValues = z.infer<typeof orderUpdateSchema>;

interface OrderFormProps {
  order: Order;
}

export function OrderForm({ order }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Safely set default values with type checking
  const defaultValues: OrderUpdateValues = {
    orderStatus: order.orderStatus,
    paymentStatus:
      order.paymentStatus === "PENDING" ||
      order.paymentStatus === "PAID" ||
      order.paymentStatus === "FAILED" ||
      order.paymentStatus === "REFUNDED"
        ? order.paymentStatus
        : "PENDING",
    paidAmount: Math.min(order.paidAmount, order.totalValue),
  };

  const form = useForm<OrderUpdateValues>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues,
  });

  const paidAmount = form.watch("paidAmount");

  const updatePaymentStatus = (amount: number) => {
    if (amount <= 0) {
      form.setValue("paymentStatus", "PENDING");
    } else if (amount >= order.totalValue) {
      form.setValue("paymentStatus", "PAID");
    } else if (amount > 0 && amount < order.totalValue) {
      const currentStatus = form.getValues("paymentStatus");
      if (currentStatus === "PENDING" || currentStatus === "PAID") {
        form.setValue("paymentStatus", "PENDING");
      }
    }
  };

  const handleSubmit = async (data: OrderUpdateValues) => {
    setIsSubmitting(true);

    try {
      // Ensure paidAmount doesn't exceed total value
      const submissionData = {
        ...data,
        paidAmount: Math.min(data.paidAmount, order.totalValue),
      };

      const response = await patchData(`orders/${order.id}/status`, submissionData);

      if (!response) {
        throw new Error("No response from server");
      }

      if (response.statusCode === 200) {
        toast.success("Order updated successfully");
        router.push("/admin/orders"); // Use specific route instead of back()
      } else {
        toast.error(response.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate subtotal (before shipping)
  const calculateSubtotal = () => {
    return order.items.reduce((total, item) => {
      return total + item.product.sellingPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = Number(order.shippingMethod?.cost || 0);
  const total = order.totalValue;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="p-6 space-y-6">
          {/* Order Status Section */}
          <Section title="Update Order Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {/* Payment Information */}
          <Section title="Payment Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormLabel>Total Order Value</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20 font-medium">
                    {formatCurrencyEnglish(order.totalValue)}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max={order.totalValue}
                          {...field}
                          onChange={(e) => {
                            const value =
                              Number.parseFloat(e.target.value) || 0;
                            field.onChange(value);
                            updatePaymentStatus(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Due Amount</FormLabel>
                  <div
                    className={`p-2 border rounded-md ${
                      paidAmount >= order.totalValue
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    } font-medium`}
                  >
                    {formatCurrencyEnglish(
                      Math.max(0, order.totalValue - paidAmount)
                    )}
                  </div>
                </div>
              </div>

              {/* Payment progress bar */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span>
                    {Math.min(
                      100,
                      Math.round((paidAmount / order.totalValue) * 100)
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (paidAmount / order.totalValue) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Order Information (Read-only) */}
          <Section title="Order Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormLabel>Order Number</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20">
                    {order.orderNo}
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Order Date</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Last Updated</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Customer</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20">
                    <p>{order.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.mobileNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Shipping Address</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/20">
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.area}, {order.address.city}
                    </p>
                    <p>{order.address.division}</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Order Items Section */}
          <Section title="Order Items">
            <div className="space-y-4">
              {/* Order items table */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                            {item.product.attachment ? (
                              <Image
                                src={
                                  item.product.attachment.url ||
                                  "/placeholder.svg"
                                }
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-muted">
                                <span className="text-xs text-muted-foreground">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.product.productSku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyEnglish(item.product.sellingPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrencyEnglish(
                            item.product.sellingPrice * item.quantity
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Value breakdown */}
              <div className="border rounded-md p-4 space-y-3">
                <h3 className="font-medium text-lg mb-2">
                  Order Value Breakdown
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrencyEnglish(subtotal)}</span>
                  </div>

                  {order.totalDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Minus className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-muted-foreground">Discount</span>
                      </div>
                      <span className="text-red-500">
                        -{formatCurrencyEnglish(order.totalDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-xs ml-2 text-muted-foreground">
                        ({order.shippingMethod?.name})
                      </span>
                    </div>
                    <span>{formatCurrencyEnglish(shippingCost)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span>{formatCurrencyEnglish(total)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span>{formatCurrencyEnglish(paidAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Due Amount</span>
                    <span
                      className={
                        paidAmount >= total ? "text-green-600" : "text-red-600"
                      }
                    >
                      {formatCurrencyEnglish(Math.max(0, total - paidAmount))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="flex justify-end p-6 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/orders")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Order...
              </>
            ) : (
              "Update Order"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
