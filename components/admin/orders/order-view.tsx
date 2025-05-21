"use client";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Pencil,
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
import { formatCurrencyEnglish, formatDateTime } from "@/lib/utils";
import type { Order, OrderItem } from "@/utils/types";
import Link from "next/link";

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
        return <CheckCircle className="size-4 mr-1" />;
      case OrderStatus.PENDING:
      case OrderStatus.PROCESSING:
        return <Clock className="size-4 mr-1" />;
      case OrderStatus.CANCELLED:
      case "failed":
        return <XCircle className="size-4 mr-1" />;
      case OrderStatus.SHIPPED:
        return <Truck className="size-4 mr-1" />;
      default:
        return null;
    }
  };



  const calculateOrderSummary = () => {
    let originalSubtotal = 0;
    let productDiscountTotal = 0;

    order.items.forEach((item) => {
      const originalItemPrice = item.product.sellingPrice * item.quantity;
      originalSubtotal += originalItemPrice;

      if (item.product.discountValue) {
        let discountAmount = 0;
        if (item.product.discountType === "percentage") {
          discountAmount =
            originalItemPrice * (Number(item.product.discountValue) / 100);
        } else if (item.product.discountType === "fixed") {
          discountAmount = Number(item.product.discountValue) * item.quantity;
        }
        productDiscountTotal += discountAmount;
      }
    });

    const couponDiscount = order.coupon
      ? Number(order.totalDiscount) - productDiscountTotal
      : 0;

    return {
      originalSubtotal,
      productDiscountTotal,
      couponDiscount,
      shippingCost: Number(order.shippingMethod.cost),
      total: order.totalValue,
    };
  };

  const orderSummary = calculateOrderSummary();
  const calculateDiscountedPrice = (
    price: number,
    discountType: string,
    discountValue: string
  ) => {
    if (discountType === "percentage") {
      return price - price * (Number.parseFloat(discountValue) / 100);
    }
    return price - Number.parseFloat(discountValue);
  };
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
                <ArrowLeft className="size-4" />
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
            <Button variant="default" asChild>
              <Link href={`/admin/order/${order.id}/edit`}>
                Edit <Pencil className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="size-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Header for Print */}
        <div className="hidden print:flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-sm text-muted-foreground">
            Order #{order.orderNo}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-background">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-lg font-semibold">Order-{order.orderNo}</h2>
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
            {/* Order Items */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-base font-medium flex items-center">
                  <Package className="size-5 mr-2" />
                  Order Items
                </h3>
              </div>
              <div>
                <div className="space-y-4">
                  {order.items.map((item: OrderItem) => {
                    const discountedPrice = calculateDiscountedPrice(
                      item.product.sellingPrice,
                      item.product.discountType ?? "",
                      (item.product.discountValue ?? 0).toString()
                    );
                    const hasDiscount =
                      item.product.discountValue &&
                      item.product.discountValue > 0;

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[64px_1fr_auto] gap-4 py-3 border-b last:border-0"
                      >
                        {/* Product Image */}
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                          {item.product.attachment ? (
                            <Image
                              src={
                                item.product.attachment.url ||
                                "/placeholder.svg"
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 64px, 96px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Package className="size-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-semibold line-clamp-2">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.product.description}
                          </p>
                          {hasDiscount && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-[0.7rem] bg-green-100 text-green-800 border-green-200"
                            >
                              {item.product.discountType === "percentage"
                                ? `${item.product.discountValue}% OFF`
                                : `${item.product.discountValue} OFF`}
                            </Badge>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col items-end space-y-1.5">
                          <div className="flex items-center gap-2">
                            {hasDiscount && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatCurrencyEnglish(
                                  item.product.sellingPrice
                                )}
                              </span>
                            )}
                            <span
                              className={`text-sm ${
                                hasDiscount
                                  ? "text-green-700 font-semibold"
                                  : "font-medium"
                              }`}
                            >
                              {formatCurrencyEnglish(discountedPrice)}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            {formatCurrencyEnglish(
                              discountedPrice * item.quantity
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            × {item.quantity} {item.product.unit?.name || "pc"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="pb-3">
                  <h3 className="text-base font-medium flex items-center">
                    <CreditCard className="size-5 mr-2" />
                    Payment Information
                  </h3>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment Method
                      </span>
                      <span className="text-sm font-medium">
                        {order.paymentMethod.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
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
                        <span className="text-sm text-muted-foreground">
                          Amount Paid
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrencyEnglish(order.paidAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="pb-3">
                  <h3 className="text-base font-medium flex items-center">
                    <Truck className="size-5 mr-2" />
                    Shipping Information
                  </h3>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Shipping Method
                      </span>
                      <span className="text-sm font-medium">
                        {order.shippingMethod.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Delivery Time
                      </span>
                      <span className="text-sm">
                        {order.shippingMethod.deliveryTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Shipping Cost
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrencyEnglish(
                          Number(order.shippingMethod.cost)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Order Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-base font-medium flex items-center">
                  <User className="size-5 mr-2" />
                  Customer Information
                </h3>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="size-10">
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
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm">{order.user.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}

            <div className="border rounded-lg p-4 bg-background">
              {/* Section Header */}
              <div className="pb-3">
                <h3 className="text-base font-medium flex items-center">
                  <MapPin className="size-5 mr-2 text-muted-foreground" />
                  Shipping Address
                </h3>
              </div>

              {/* Shipping Address Details */}
              <div className="space-y-3 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Name:
                  </p>
                  <p className="text-sm">{order.user.name}</p>
                </div>

                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Address:
                  </p>
                  <p className="text-sm">{order.address.address}</p>
                </div>

                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Area / City:
                  </p>
                  <p className="text-sm">
                    {order.address.area}, {order.address.city}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Division:
                  </p>
                  <p className="text-sm">{order.address.division}</p>
                </div>

                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Phone:
                  </p>
                  <p className="text-sm">{order.user.mobileNumber}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 bg-background">
              <div className="pb-3">
                <h3 className="text-base font-medium flex items-center">
                  <FileText className="size-5 mr-2" />
                  Order Summary
                </h3>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-sm">
                      ৳{orderSummary.originalSubtotal.toLocaleString()}
                    </span>
                  </div>

                  {orderSummary.productDiscountTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Tag className="size-3 mr-1" />
                        Product Discounts
                      </span>
                      <span className="text-sm text-green-600">
                        -৳{orderSummary.productDiscountTotal.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {order.coupon && orderSummary.couponDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Tag className="size-3 mr-1" />
                        Coupon Discount ({order.coupon.code})
                      </span>
                      <span className="text-sm text-green-600">
                        -৳{orderSummary.couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-sm">
                      ৳{orderSummary.shippingCost.toLocaleString()}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>৳{orderSummary.total.toLocaleString()}</span>
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
