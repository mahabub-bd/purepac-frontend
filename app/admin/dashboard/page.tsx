import OrdersTable from "@/components/admin/dashboard/orders-table";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrencyEnglish,
  getTopBrandByProductCount,
  getTopCategoryByProductCount,
} from "@/lib/utils";
import {
  fetchData,
  fetchDataPagination,
  fetchProtectedData,
} from "@/utils/api-utils";
import type {
  ApiResponseusers,
  Brand,
  Category,
  OrderResponse,
  OrderSummary,
  Product,
} from "@/utils/types";

import CombinedOrdersSalesChart from "@/components/admin/dashboard/combined-order-saleschart";
import {
  Activity,
  DollarSign,
  Layers,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";

export default async function DashboardPage() {
  const products = await fetchData<Product[]>("products?limit=100");

  const categories = await fetchData<Category[]>("categories");
  const brands = await fetchData<Brand[]>("brands");
  const response = await fetchDataPagination<ApiResponseusers>("users");
  const orders = await fetchDataPagination<OrderResponse>(`orders`);
  const chartdata = await fetchProtectedData("orders/reports/monthly");

  const customers = [...response.data.customers];
  const totalSales = (chartdata as { totalValue: number }[]).reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatsCard
          title="Total Sales"
          value={formatCurrencyEnglish(totalSales)}
          description="+20.1% from last month"
          trend="up"
          icon={DollarSign}
          colorScheme="green"
        />
        <StatsCard
          title="Total Orders"
          value={orders.total.toString()}
          description="+12.2% from last month"
          trend="up"
          icon={ShoppingCart}
          colorScheme="purple"
        />
        <StatsCard
          title="Products"
          value={products?.length?.toString() || "0"}
          description="+5.4% from last month"
          trend="up"
          icon={Package}
          colorScheme="amber"
        />
        <StatsCard
          title="Customers"
          value={customers?.length?.toString() || "0"}
          description="+3.1% from last month"
          trend="up"
          icon={Users}
          colorScheme="blue"
        />
        <StatsCard
          title="Categories"
          value={categories?.length?.toString() || "0"}
          description={`${getTopCategoryByProductCount(categories)} is top`}
          trend="neutral"
          icon={Layers}
          colorScheme="indigo"
        />
        <StatsCard
          title="Brands"
          value={brands?.length?.toString() || "0"}
          description={`${getTopBrandByProductCount(brands)} is top`}
          trend="neutral"
          icon={Tag}
          colorScheme="violet"
        />
      </div>

      <CombinedOrdersSalesChart chartData={chartdata as OrderSummary[]} />
      <OrdersTable />
      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-none">
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
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-none">
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
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-none">
          <CardHeader className="pb-2">
            <CardTitle>Top Selling Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {getTopCategoryByProductCount(categories)}
                </p>
                <p className="text-xs text-muted-foreground">
                  32% of total sales
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-700 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
