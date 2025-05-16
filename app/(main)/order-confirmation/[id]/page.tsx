import {
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyEnglish, formatDateTime } from "@/lib/utils";
import { fetchProtectedData } from "@/utils/api-utils";
import { Order, OrderItem } from "@/utils/types";

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
      <div className="flex flex-col gap-6">
        {/* Order Status Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Order #{order.orderNo}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDateTime(order?.createdAt)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge
              variant={order.orderStatus === "PENDING" ? "outline" : "default"}
              className="px-3 py-1 text-sm"
            >
              {order.orderStatus === "PENDING" ? (
                <Clock className="mr-1 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-1 h-4 w-4" />
              )}
              Order: {order.orderStatus}
            </Badge>
            <Badge
              variant={
                order.paymentStatus === "PENDING" ? "outline" : "default"
              }
              className="px-3 py-1 text-sm"
            >
              {order.paymentStatus === "PENDING" ? (
                <Clock className="mr-1 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-1 h-4 w-4" />
              )}
              Payment: {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={
                    order.user.profilePhoto?.url ||
                    "/placeholder.svg?height=48&width=48&query=user"
                  }
                  alt={order.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{order.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.user.email}
                </p>
              </div>
            </div>
            <p className="text-sm flex items-center">
              <span className="font-medium mr-2">Phone:</span>{" "}
              {order.user.mobileNumber}
            </p>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Shipping Information</h2>
            </div>
            <div className="mb-3">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.address.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.address.area}, {order.address.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.address.division}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <div>
                <span className="font-medium">{order.shippingMethod.name}</span>
                <p className="text-muted-foreground">
                  {order.shippingMethod.deliveryTime}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>
            <div className="mb-3">
              <p className="font-medium">{order.paymentMethod.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.paymentMethod.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Total Amount:</p>
                <p className="font-medium">
                  {formatCurrencyEnglish(order.totalValue)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Paid Amount:</p>
                <p className="font-medium">
                  {formatCurrencyEnglish(order.paidAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Package className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Order Items</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}{" "}
              in your order
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItem) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.product.sellingPrice,
                    item.product.discountType ?? "",
                    (item.product.discountValue ?? 0).toString()
                  );

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={
                              item.product.attachment?.url ||
                              "/placeholder.svg?height=64&width=64&query=product"
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {item.product.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrencyEnglish(item.product.sellingPrice)}
                      </TableCell>
                      <TableCell>
                        {item.product.discountValue}
                        {item.product.discountType === "percentage" ? "%" : "৳"}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.product.unit?.name || "Piece"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrencyEnglish(discountedPrice * item.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-end mt-6">
            <div className="w-full md:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  {formatCurrencyEnglish(
                    order.totalValue -
                      Number.parseFloat(order.shippingMethod.cost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {formatCurrencyEnglish(
                    Number.parseFloat(order.shippingMethod.cost)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrencyEnglish(order.totalValue)}</span>
              </div>
              <Button className="w-full mt-4">
                {order.paymentStatus === "PENDING" ? (
                  "Pay Now"
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
