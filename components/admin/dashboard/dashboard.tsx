"use client";

import { useState } from "react";
import {
  BarChart3,
  Package,
  Users,
  Settings,
  ShoppingCart,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  Home,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="text-lg font-semibold">ShopDash</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="space-y-1 px-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start gap-3 font-normal"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
                <Badge className="ml-auto">24</Badge>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <Package className="h-5 w-5" />
                Products
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <Users className="h-5 w-5" />
                Customers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <BarChart3 className="h-5 w-5" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 font-normal"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Avatar"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative ml-auto flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 rounded-full bg-background pl-8"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Avatar"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <Select defaultValue="today">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2,350</div>
                  <p className="text-xs text-muted-foreground">
                    +12.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +3.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +1.2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Orders section */}
            <div>
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <TabsList>
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-4">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Date
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Status
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                #{order.id}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {getInitials(order.customer)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="hidden md:inline">
                                    {order.customer}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {order.date}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant={getStatusVariant(order.status)}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                ${order.amount.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Update status
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Cancel order
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t p-4">
                      <div className="text-xs text-muted-foreground">
                        Showing <strong>1</strong> to <strong>10</strong> of{" "}
                        <strong>100</strong> results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">Pending Orders</h3>
                        <p className="text-sm text-muted-foreground">
                          Filter applied to show only pending orders.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">
                          Completed Orders
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Filter applied to show only completed orders.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cancelled" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">
                          Cancelled Orders
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Filter applied to show only cancelled orders.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper functions
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

// Sample data
const orders = [
  {
    id: "1001",
    customer: "John Doe",
    date: "Apr 3, 2023",
    status: "Completed",
    amount: 125.99,
  },
  {
    id: "1002",
    customer: "Jane Smith",
    date: "Apr 2, 2023",
    status: "Processing",
    amount: 89.5,
  },
  {
    id: "1003",
    customer: "Robert Johnson",
    date: "Apr 2, 2023",
    status: "Completed",
    amount: 245.0,
  },
  {
    id: "1004",
    customer: "Emily Davis",
    date: "Apr 1, 2023",
    status: "Processing",
    amount: 32.75,
  },
  {
    id: "1005",
    customer: "Michael Wilson",
    date: "Mar 31, 2023",
    status: "Cancelled",
    amount: 149.99,
  },
  {
    id: "1006",
    customer: "Sarah Taylor",
    date: "Mar 30, 2023",
    status: "Completed",
    amount: 55.25,
  },
  {
    id: "1007",
    customer: "David Brown",
    date: "Mar 29, 2023",
    status: "Processing",
    amount: 78.5,
  },
  {
    id: "1008",
    customer: "Lisa Anderson",
    date: "Mar 28, 2023",
    status: "Completed",
    amount: 214.3,
  },
  {
    id: "1009",
    customer: "Thomas Martinez",
    date: "Mar 27, 2023",
    status: "Cancelled",
    amount: 99.99,
  },
  {
    id: "1010",
    customer: "Jennifer Garcia",
    date: "Mar 26, 2023",
    status: "Completed",
    amount: 175.25,
  },
];
