"use client";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Printer,
  Tag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { formatDateTime } from "@/lib/utils";
import type { Order, OrderItem } from "@/utils/types";

// Order status enum
enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

interface OrderViewProps {
  order: Order;
  onBack?: () => void;
}

export default function OrderView({ order, onBack }: OrderViewProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const subtotal: number = order.totalValue - Number(order.shippingMethod.cost);

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case OrderStatus.DELIVERED:
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case OrderStatus.PENDING:
      case OrderStatus.PROCESSING:
        return <Clock className="h-4 w-4 mr-1" />;
      case OrderStatus.CANCELLED:
      case "failed":
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
    <div className={`${isPrinting ? "print-mode" : ""}`}>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode,
          .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex flex-col space-y-6 p-4 md:p-6">
        {/* Header with back button and actions */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Order Details</h1>
            <Badge
              variant="outline"
              className={getOrderStatusColor(order.orderStatus)}
            >
              {getStatusIcon(order.orderStatus)}
              {order.orderStatus.charAt(0).toUpperCase() +
                order.orderStatus.slice(1)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Header for Print */}
        <div className="hidden print:flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-muted-foreground">Order #{order.orderNo}</p>
          <p className="text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-background">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.orderNo}</h2>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getOrderStatusColor(order.orderStatus)}
              >
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus.charAt(0).toUpperCase() +
                  order.orderStatus.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className={getPaymentStatusColor(order.paymentStatus)}
              >
                {getStatusIcon(order.paymentStatus)}
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </h3>
              </div>
              <div>
                <div className="space-y-4">
                  {order.items.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 py-3 border-b last:border-0"
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.attachment ? (
                          <Image
                            src={
                              item.product.attachment.url || "/placeholder.svg"
                            }
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.product.productSku}
                        </p>
                        {item.product.discountValue && (
                          <div className="flex items-center mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              {item.product.discountType === "percentage"
                                ? `${item.product.discountValue}% OFF`
                                : `${item.product.discountValue} OFF`}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ৳{item.product.sellingPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-sm font-medium mt-1">
                          ৳
                          {(
                            item.product.sellingPrice * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h3>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="font-medium">
                      {order.paymentMethod.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Status
                    </span>
                    <Badge
                      variant="outline"
                      className={getPaymentStatusColor(order.paymentStatus)}
                    >
                      {getStatusIcon(order.paymentStatus)}
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  {order.paidAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-medium">
                        ৳{order.paidAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h3>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Shipping Method
                    </span>
                    <span className="font-medium">
                      {order.shippingMethod.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span>{order.shippingMethod.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Cost</span>
                    <span className="font-medium">
                      ৳
                      {Number.parseFloat(
                        order.shippingMethod.cost
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Order Status Timeline
                </h3>
              </div>
              <div className="pl-2">
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
                              <h4
                                className={`text-sm font-medium ${
                                  !isActive ? "text-gray-400" : ""
                                }`}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </h4>
                              {timestamp ? (
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(timestamp)}
                                </span>
                              ) : (
                                isActive && (
                                  <span className="text-xs text-muted-foreground">
                                    {status === order.orderStatus
                                      ? "Current"
                                      : ""}
                                  </span>
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
              </div>
            </div>
          </div>

          {/* Customer and Order Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={order.user.profilePhoto?.url || "/placeholder.svg"}
                      alt={order.user.name}
                    />
                    <AvatarFallback>{order.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{order.user.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{order.user.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h3>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="font-medium">{order.user.name}</p>
                  <p>{order.address.address}</p>
                  <p>
                    {order.address.area}, {order.address.city}
                  </p>
                  <p>{order.address.division}</p>
                  <p className="text-muted-foreground">
                    {order.user.mobileNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Order Summary
                </h3>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  {order.coupon && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        Discount ({order.coupon.code})
                      </span>
                      <span className="text-green-600">
                        -৳
                        {order.totalDiscount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      ৳
                      {Number.parseFloat(
                        order.shippingMethod.cost
                      ).toLocaleString()}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>৳{order.totalValue.toLocaleString()}</span>
                  </div>
                  {order.paymentStatus === "pending" && (
                    <div className="flex justify-between text-red-600 text-sm">
                      <span>Due Amount</span>
                      <span>
                        ৳
                        {(order.totalValue - order.paidAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 text-center text-sm text-muted-foreground">
          <p>Thank you for your business!</p>
          <p>For any questions, please contact support@yourstore.com</p>
        </div>
      </div>
    </div>
  );
}
