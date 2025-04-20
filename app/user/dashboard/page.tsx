import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BadgePercent,
  Bookmark,
  Clock,
  Gift,
  Heart,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function UserDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Welcome back, John!</p>
        </div>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {/* Order Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Active Orders"
          value="2"
          description="Track your packages"
          icon={Truck}
          href="/orders"
        />
        <StatusCard
          title="Wishlist"
          value="8"
          description="Items you've saved"
          icon={Heart}
          href="/wishlist"
        />
        <StatusCard
          title="Reward Points"
          value="350"
          description="Points available to redeem"
          icon={Gift}
          href="/rewards"
        />
        <StatusCard
          title="Cart"
          value="3"
          description="Items in your cart"
          icon={ShoppingCart}
          href="/cart"
        />
      </div>

      {/* Recent Orders and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your recent purchases</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/orders">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items} {order.items > 1 ? "items" : "item"} • $
                      {order.amount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/orders">View Order History</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>Based on your purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < product.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.price}</p>
                    <Button size="sm" variant="ghost" className="mt-1 h-7 px-2">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/recommendations">View All Recommendations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Additional Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Special Offers</CardTitle>
            <CardDescription>Deals just for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {specialOffers.map((offer) => (
                <div key={offer.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <BadgePercent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{offer.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/offers">View All Offers</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recently Viewed</CardTitle>
            <CardDescription>Products you&apos;ve checked out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/history">View Browsing History</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Deliveries</CardTitle>
            <CardDescription>Track your packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Order #{delivery.orderId}
                    </p>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                      <p className="text-xs text-muted-foreground">
                        {delivery.eta}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">
                    Track
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/deliveries">View All Deliveries</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

function StatusCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
          <Link href={href}>
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

const recentOrders = [
  {
    id: "ORD-7291",
    items: 3,
    amount: "125.99",
    status: "Delivered",
    date: "Apr 2, 2023",
  },
  {
    id: "ORD-7292",
    items: 1,
    amount: "89.50",
    status: "In Transit",
    date: "Apr 5, 2023",
  },
  {
    id: "ORD-7293",
    items: 4,
    amount: "245.00",
    status: "Processing",
    date: "Apr 7, 2023",
  },
];

const recommendedProducts = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: "249.99",
    rating: 4,
    reviews: 128,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: "89.95",
    rating: 5,
    reviews: 94,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: "59.99",
    rating: 4,
    reviews: 76,
    image: "/placeholder.svg?height=64&width=64",
  },
];

const specialOffers = [
  {
    id: 1,
    title: "20% Off Electronics",
    description: "Use code TECH20 at checkout",
  },
  {
    id: 2,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    id: 3,
    title: "Buy One Get One Free",
    description: "On selected items",
  },
];

const recentlyViewed = [
  {
    id: 1,
    name: 'Ultra HD Smart TV - 55"',
    price: "699.99",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: "189.99",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: "24.95",
    image: "/placeholder.svg?height=40&width=40",
  },
];

const upcomingDeliveries = [
  {
    id: 1,
    orderId: "7292",
    eta: "Arriving tomorrow",
  },
  {
    id: 2,
    orderId: "7293",
    eta: "Arriving in 3 days",
  },
];
