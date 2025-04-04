import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated:</span>
          <span className="font-medium text-foreground">
            April 4, 2023 at 7:38 AM
          </span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Orders"
          value="2,350"
          description="+12.2% from last month"
          trend="up"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Products"
          value="485"
          description="+5.4% from last month"
          trend="up"
          icon={Package}
        />
        <StatsCard
          title="Customers"
          value="12,234"
          description="-2.5% from last month"
          trend="down"
          icon={Users}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Sales chart visualization would appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Order #{order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">3.2%</p>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last week
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">$45.82</p>
                <p className="text-xs text-muted-foreground">
                  +2.3% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Selling Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">Electronics</p>
                <p className="text-xs text-muted-foreground">
                  32% of total sales
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
}

function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === "up" && (
            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
          )}
          {trend === "down" && (
            <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
          )}
          <span
            className={
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                ? "text-rose-500"
                : ""
            }
          >
            {description}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

const recentOrders = [
  {
    id: "1001",
    customer: "John Doe",
    amount: "125.99",
    date: "2 hours ago",
  },
  {
    id: "1002",
    customer: "Jane Smith",
    amount: "89.50",
    date: "5 hours ago",
  },
  {
    id: "1003",
    customer: "Robert Johnson",
    amount: "245.00",
    date: "Yesterday",
  },
  {
    id: "1004",
    customer: "Emily Davis",
    amount: "32.75",
    date: "Yesterday",
  },
  {
    id: "1005",
    customer: "Michael Wilson",
    amount: "149.99",
    date: "2 days ago",
  },
];
