"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrencyEnglish } from "@/lib/utils";
import { OrderSummary } from "@/utils/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CombinedOrdersSalesChartProps {
  chartData: OrderSummary[];
}

const ORDERS_COLOR = "hsl(215, 70%, 60%)"; // Blue for orders
const SALES_COLOR = "hsl(145, 70%, 50%)"; // Green for sales

export default function CombinedOrdersSalesChart({
  chartData,
}: CombinedOrdersSalesChartProps) {
  const totalOrders = chartData.reduce((sum, item) => sum + item.orderCount, 0);
  const totalSales = chartData.reduce((sum, item) => sum + item.totalValue, 0);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: unknown[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry: unknown, index: number) => {
            const e = entry as {
              color?: string;
              name?: string;
              value?: number;
            };
            return (
              <div
                key={`item-${index}`}
                className="flex items-center text-sm"
                style={{ color: e.color }}
              >
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: e.color }}
                />
                <span className="mr-2">{e.name}:</span>
                <span className="font-medium">
                  {e.name === "Sales"
                    ? formatCurrencyEnglish(e.value ?? 0)
                    : (e.value ?? 0).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`w-full `}>
      <CardHeader>
        <CardTitle>Orders & Sales Overview</CardTitle>
        <CardDescription>
          {totalOrders.toLocaleString()} orders with{" "}
          {formatCurrencyEnglish(totalSales)} in sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="combined">Combined View</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="combined" className="mt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value.toString()}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  yAxisId="left"
                  dataKey="orderCount"
                  name="Orders"
                  fill={ORDERS_COLOR}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  yAxisId="right"
                  dataKey="totalValue"
                  name="Sales"
                  fill={SALES_COLOR}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="orderCount"
                  name="Orders"
                  fill={ORDERS_COLOR}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  {chartData.map((entry, index) => (
                    <text
                      key={`label-${index}`}
                      x={
                        index * (100 / chartData.length) +
                        100 / chartData.length / 2
                      }
                      y={
                        350 -
                        (entry.orderCount /
                          Math.max(...chartData.map((d) => d.orderCount))) *
                          300 -
                        10
                      }
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                    >
                      {entry.orderCount}
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="sales" className="mt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalValue"
                  name="Sales"
                  fill={SALES_COLOR}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  {chartData.map((entry, index) => (
                    <text
                      key={`label-${index}`}
                      x={
                        index * (100 / chartData.length) +
                        100 / chartData.length / 2
                      }
                      y={
                        350 -
                        (entry.totalValue /
                          Math.max(...chartData.map((d) => d.totalValue))) *
                          300 -
                        10
                      }
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                    >
                      {`$${(entry.totalValue / 1000).toFixed(0)}k`}
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
