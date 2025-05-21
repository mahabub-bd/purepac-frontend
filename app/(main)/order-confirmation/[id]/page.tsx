import {
  Building,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  FileText,
  Home,
  Map,
  MapPin,
  Package,
  Phone,
  Tag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyEnglish, formatDateTime } from "@/lib/utils";
import { fetchProtectedData } from "@/utils/api-utils";
import type { Order, OrderItem } from "@/utils/types";

// Order status enum
enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

async function fetchOrder(id: string) {
  try {
    const order = await fetchProtectedData<Order>(`orders/${id}`);
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchOrder(id);

  if (!order) {
    notFound();
  }

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Order Status Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border">
          <div>
            <h1 className="text-xl md:text-xl font-bold">
              Order-{order.orderNo}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge
              variant="outline"
              className={getOrderStatusColor(order.orderStatus)}
            >
              Order Status: {getStatusIcon(order.orderStatus)}
              {order.orderStatus.charAt(0).toUpperCase() +
                order.orderStatus.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className={getPaymentStatusColor(order.paymentStatus)}
            >
              Payment Status: {getStatusIcon(order.paymentStatus)}
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items and Timeline */}
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
                      src={
                        order.user.profilePhoto?.url ||
                        "/placeholder.svg?height=40&width=40&query=user"
                      }
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
              <div className="pb-3">
                <h3 className="text-base font-medium flex items-center">
                  <MapPin className="size-5 mr-2 text-muted-foreground" />
                  Shipping Address
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm flex items-center">
                  <User className="size-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Name : </span> {order.user.name}
                </p>
                <p className="text-sm flex items-center">
                  <Home className="size-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Address : </span>{" "}
                  {order.address.address}
                </p>
                <p className="text-sm flex items-center">
                  <Building className="size-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Area / City : </span>{" "}
                  {order.address.area}, {order.address.city}
                </p>
                <p className="text-sm flex items-center">
                  <Map className="size-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Division : </span>{" "}
                  {order.address.division}
                </p>
                <p className="text-sm flex items-center">
                  <Phone className="size-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Phone : </span>{" "}
                  {order.user.mobileNumber}
                </p>
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
                      {formatCurrencyEnglish(orderSummary.originalSubtotal)}
                    </span>
                  </div>

                  {orderSummary.productDiscountTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Tag className="size-3 mr-1" />
                        Product Discounts
                      </span>
                      <span className="text-sm text-green-600">
                        -
                        {formatCurrencyEnglish(
                          orderSummary.productDiscountTotal
                        )}
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
                        -{formatCurrencyEnglish(orderSummary.couponDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-sm">
                      {formatCurrencyEnglish(orderSummary.shippingCost)}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>{formatCurrencyEnglish(orderSummary.total)}</span>
                  </div>

                  {order.paymentStatus.toLowerCase() === "pending" && (
                    <div className="flex justify-between text-red-600 text-sm">
                      <span>Due Amount</span>
                      <span>
                        {formatCurrencyEnglish(
                          order.totalValue - order.paidAmount
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {order.paymentStatus.toLowerCase() === "pending" ? (
                <Button className="w-full">Pay Now</Button>
              ) : (
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
