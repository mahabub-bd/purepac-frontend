"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Receipt,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { formatCurrencyEnglish, formatDateTime } from "@/lib/utils";
import { patchData } from "@/utils/api-utils";
import type { Order } from "@/utils/types";
import { CheckCircle, Truck, XCircle } from "lucide-react";
import { Section } from "../helper";

// Create strict schema for admin updates
const orderUpdateSchema = z.object({
  orderStatus: z.union([
    z.literal("pending"),
    z.literal("processing"),
    z.literal("shipped"),
    z.literal("delivered"),
    z.literal("cancelled"),
  ]),
});

// Order status enum
enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

type OrderUpdateValues = z.infer<typeof orderUpdateSchema>;

interface OrderFormProps {
  order: Order;
}

export function OrderForm({ order }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const defaultValues: OrderUpdateValues = {
    orderStatus:
      order.orderStatus === "pending" ||
      order.orderStatus === "shipped" ||
      order?.orderStatus === "cancelled" ||
      order?.orderStatus === "delivered" ||
      order?.orderStatus === "processing"
        ? order?.orderStatus
        : "pending",
  };

  const form = useForm<OrderUpdateValues>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues,
  });

  const handleSubmit = async (data: OrderUpdateValues) => {
    setIsSubmitting(true);

    try {
      // Update order status
      const orderStatusResponse = await patchData(
        `orders/${order.id}/order-status`,
        {
          status: data.orderStatus,
        }
      );

      if (!orderStatusResponse || orderStatusResponse.statusCode !== 200) {
        throw new Error(
          orderStatusResponse?.message || "Failed to update order status"
        );
      }

      toast.success("Order status updated successfully");
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return order.items.reduce((total, item) => {
      return total + item.product.sellingPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = Number(order.shippingMethod?.cost || 0);
  const total = order.totalValue;
  const paidAmount = order.paidAmount || 0;

  // Status timeline helpers
  const getStatusDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case OrderStatus.PENDING:
        return "bg-yellow-500";
      case OrderStatus.PROCESSING:
        return "bg-blue-500";
      case OrderStatus.SHIPPED:
        return "bg-purple-500";
      case OrderStatus.DELIVERED:
        return "bg-green-500";
      case OrderStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case OrderStatus.PENDING:
      case OrderStatus.PROCESSING:
        return <Clock className="h-4 w-4 mr-1" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="h-4 w-4 mr-1" />;
      case OrderStatus.SHIPPED:
        return <Truck className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Generate a complete timeline with all order statuses
  const generateOrderTimeline = () => {
    // Create a map of all possible statuses
    const allStatuses = [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];

    // Get the current order status
    const currentStatus = order.orderStatus.toLowerCase();

    // If order is cancelled, only show statuses up to cancellation
    if (currentStatus === OrderStatus.CANCELLED) {
      return [OrderStatus.PENDING, OrderStatus.CANCELLED];
    }

    // For normal order flow, show all statuses up to the current one
    const statusIndex = allStatuses.findIndex(
      (status) => status === currentStatus
    );
    if (statusIndex >= 0) {
      return allStatuses.slice(0, statusIndex + 1);
    }

    // Fallback to just showing the current status
    return [currentStatus];
  };

  // Get the timestamp for a specific status from statusTracks
  const getStatusTimestamp = (status: string) => {
    const statusTrack = order.statusTracks.find(
      (track) => track.status.toLowerCase() === status.toLowerCase()
    );
    return statusTrack ? statusTrack.createdAt : null;
  };

  // Get the note for a specific status from statusTracks
  const getStatusNote = (status: string) => {
    const statusTrack = order.statusTracks.find(
      (track) => track.status.toLowerCase() === status.toLowerCase()
    );
    return statusTrack ? statusTrack.note : null;
  };

  // Get the user who updated a specific status
  const getStatusUpdatedBy = (status: string) => {
    const statusTrack = order.statusTracks.find(
      (track) => track.status.toLowerCase() === status.toLowerCase()
    );
    return statusTrack ? statusTrack.updatedBy : null;
  };

  // Check if a status is active (current or past)
  const isStatusActive = (status: string) => {
    const currentStatus = order.orderStatus.toLowerCase();

    // If order is cancelled, only pending and cancelled are active
    if (currentStatus === OrderStatus.CANCELLED) {
      return status === OrderStatus.PENDING || status === OrderStatus.CANCELLED;
    }

    // For normal flow, all statuses up to current are active
    const allStatuses = [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    const statusIndex = allStatuses.indexOf(status as OrderStatus);
    const currentIndex = allStatuses.indexOf(currentStatus as OrderStatus);

    return statusIndex <= currentIndex;
  };

  // Generate the timeline statuses
  const timelineStatuses = generateOrderTimeline();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="p-6 space-y-6 mx-auto w-full">
          <Section title="Update Order Status">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Order Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {/* Order Status Timeline */}
          <Section title="Order Status Timeline">
            <div className="pl-2">
              {order.statusTracks.length > 0 ? (
                <Timeline>
                  {timelineStatuses.map((status, index) => {
                    const isActive = isStatusActive(status);
                    const timestamp = getStatusTimestamp(status);
                    const note = getStatusNote(status);
                    const updatedBy = getStatusUpdatedBy(status);

                    return (
                      <TimelineItem key={status}>
                        <TimelineSeparator>
                          <TimelineDot
                            className={
                              isActive
                                ? getStatusDotColor(status)
                                : "bg-gray-300"
                            }
                          />
                          {index < timelineStatuses.length - 1 && (
                            <TimelineConnector
                              className={isActive ? "" : "bg-gray-300"}
                            />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <div className="ml-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {isActive && getStatusIcon(status)}
                                <h4
                                  className={`text-sm font-medium ${
                                    !isActive ? "text-gray-400" : ""
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </h4>
                              </div>
                              {timestamp ? (
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(timestamp)}
                                </span>
                              ) : (
                                isActive && (
                                  <Badge variant="outline" className="text-xs">
                                    {status === order.orderStatus
                                      ? "Current"
                                      : ""}
                                  </Badge>
                                )
                              )}
                            </div>
                            {note && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {note}
                              </p>
                            )}
                            {updatedBy ? (
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                Updated by: {updatedBy.name || "User"}
                              </div>
                            ) : (
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                Created by: {order.user.name || "User"}
                              </div>
                            )}
                          </div>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No status updates available.
                </p>
              )}
            </div>
          </Section>

          {/* Payment Information (Read-only) */}
          <Section title="Payment Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 w-full">
                <FormLabel>Total Order Value</FormLabel>
                <div className="p-3 border rounded-md bg-muted/20 font-medium h-10 flex items-center">
                  {formatCurrencyEnglish(order.totalValue)}
                </div>
              </div>

              <div className="space-y-2 w-full">
                <FormLabel>Paid Amount</FormLabel>
                <div className="p-3 border rounded-md bg-muted/20 font-medium h-10 flex items-center">
                  {formatCurrencyEnglish(paidAmount)}
                </div>
              </div>
            </div>
          </Section>

          {/* Order Information (Read-only) */}
          <Section title="Order Information">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 w-full">
                  <FormLabel className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Order Number
                  </FormLabel>
                  <div className="p-3 border rounded-md bg-muted/20 h-10 flex items-center">
                    {order.orderNo}
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <FormLabel className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Order Date
                  </FormLabel>
                  <div className="p-3 border rounded-md bg-muted/20 h-10 flex items-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <FormLabel className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Last Updated
                  </FormLabel>
                  <div className="p-3 border rounded-md bg-muted/20 h-10 flex items-center">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 w-full">
                  <FormLabel className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Customer
                  </FormLabel>
                  <div className="p-3 border rounded-md bg-muted/20 min-h-[80px]">
                    <p>{order.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.mobileNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Shipping Address
                  </FormLabel>
                  <div className="p-3 border rounded-md bg-muted/20 min-h-[80px]">
                    <p>{order.address.address}</p>
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
            <div className="space-y-6 w-full">
              {/* Order items table */}
              <div className="border rounded-md overflow-hidden w-full">
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
                                  "/placeholder.svg" ||
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
              <div className="border rounded-md p-6 space-y-4 w-full">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Order Value Breakdown
                </h3>

                <div className="space-y-3 max-w-md">
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

                  <Separator className="my-3" />

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

        <div className="flex justify-end p-6 gap-4 mx-auto w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/orders")}
            disabled={isSubmitting}
            className="w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-40 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Update Order
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
