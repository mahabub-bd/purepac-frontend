import {
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This would typically come from an API call
const fetchOrder = async (id: string) => {
  return {
    id: id,
    orderNo: "ORD-2025055933",
    orderStatus: "PENDING",
    paymentStatus: "PENDING",
    totalValue: 38080,
    paidAmount: 0,
    createdAt: "2025-05-12T16:59:56.902Z",
    updatedAt: "2025-05-12T16:59:56.902Z",
    user: {
      id: 1,
      name: "Mahabub Hossain",
      email: "palashmahabub@gmail.com",
      mobileNumber: "+8801711852202",
      profilePhoto: {
        url: "https://purepacbd.s3.ap-southeast-1.amazonaws.com/a3895160-179f-493d-b6df-1fbfb5f35626.jpg",
      },
    },
    address: {
      id: 4,
      street: "542, East Badda",
      area: "Badda",
      division: "Dhaka",
      city: "Dhaka",
      type: "shipping",
      isDefault: true,
    },
    shippingMethod: {
      id: 2,
      name: "Standard Shipping",
      cost: "80.00",
      deliveryTime: "1-2 Business Days",
      description: "Standard Shipping",
    },
    paymentMethod: {
      id: 1,
      code: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer payment",
    },
    items: [
      {
        id: 16,
        productId: 20,
        quantity: 1,
        product: {
          id: 20,
          name: "vivo V27 5G",
          slug: "vivo-v27-5g",
          description: "vivo V27 5G",
          sellingPrice: 40000,
          discountType: "percentage",
          discountValue: "5.00",
          attachment: {
            url: "https://purepacbd.s3.ap-southeast-1.amazonaws.com/a4202128-76ed-4d1d-8051-3ee506e7f46a.jpg",
          },
          unit: {
            name: "Piece",
          },
        },
      },
    ],
  };
};

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

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate discounted price
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Order #{order.orderNo}
            </h1>
            <p className="text-muted-foreground">Placed on {orderDate}</p>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={order.user.profilePhoto.url || "/placeholder.svg"}
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
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="font-medium">{order.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.street}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.area}, {order.address.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.division}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                <div>
                  <span className="font-medium">
                    {order.shippingMethod.name}
                  </span>
                  <p className="text-muted-foreground">
                    {order.shippingMethod.deliveryTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    ৳{order.totalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid Amount:</p>
                  <p className="font-medium">
                    ৳{order.paidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </CardTitle>
            <CardDescription>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}{" "}
              in your order
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {order.items.map((item) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.product.sellingPrice,
                    item.product.discountType,
                    item.product.discountValue
                  );

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={
                              item.product.attachment.url || "/placeholder.svg"
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
                        ৳{item.product.sellingPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {item.product.discountValue}
                        {item.product.discountType === "percentage" ? "%" : "৳"}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.product.unit.name}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{(discountedPrice * item.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-end">
            <div className="w-full md:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  ৳
                  {(
                    order.totalValue -
                    Number.parseFloat(order.shippingMethod.cost)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  ৳
                  {Number.parseFloat(
                    order.shippingMethod.cost
                  ).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>৳{order.totalValue.toLocaleString()}</span>
              </div>
              <Button className="w-full mt-4">
                {order.paymentStatus === "PENDING"
                  ? "Pay Now"
                  : "Download Invoice"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
