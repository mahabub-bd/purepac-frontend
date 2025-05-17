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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { Order, OrderItem } from "@/utils/types";

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

  // Calculate subtotal
  const subtotal: number = order.totalValue - Number(order.shippingMethod.cost);

  // Get status badge color
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
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
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 mr-1" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "shipped":
        return <Truck className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
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

        {/* Order Summary Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Order #{order.orderNo}</CardTitle>
              <CardDescription>
                Placed on {formatDateTime(order.createdAt)}
              </CardDescription>
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
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          {/* Customer and Order Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
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
