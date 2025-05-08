"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

type OrderData = {
  month: string;
  orders: number;
};

const monthlyOrders: OrderData[] = [
  { month: "January", orders: 200 },
  { month: "February", orders: 240 },
  { month: "March", orders: 120 },
  { month: "April", orders: 180 },
  { month: "May", orders: 220 },
  { month: "June", orders: 260 },
  { month: "July", orders: 230 },
  { month: "August", orders: 270 },
  { month: "September", orders: 250 },
  { month: "October", orders: 290 },
  { month: "November", orders: 260 },
  { month: "December", orders: 300 },
];

const COLORS = [
  "hsl(0, 70%, 60%)", // January - Red
  "hsl(30, 70%, 60%)", // February - Orange
  "hsl(60, 70%, 60%)", // March - Yellow
  "hsl(90, 70%, 60%)", // April - Light green
  "hsl(120, 70%, 60%)", // May - Green
  "hsl(150, 70%, 60%)", // June - Teal
  "hsl(180, 70%, 60%)", // July - Cyan
  "hsl(210, 70%, 60%)", // August - Light blue
  "hsl(240, 70%, 60%)", // September - Blue
  "hsl(270, 70%, 60%)", // October - Purple
  "hsl(300, 70%, 60%)", // November - Pink
  "hsl(330, 70%, 60%)", // December - Magenta
];

export default function MonthlyOrders() {
  // Create config object for ChartContainer
  const chartConfig = monthlyOrders.reduce((config, item, index) => {
    config[item.month] = {
      label: item.month,
      color: COLORS[index],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Month-Wise Orders</CardTitle>
        <CardDescription>
          You received{" "}
          {monthlyOrders.reduce((sum, item) => sum + item.orders, 0)} orders
          this year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart
              accessibilityLayer
              data={monthlyOrders}
              margin={{
                top: 5,
                right: 15,
                left: 15,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={20} />
              <Bar
                dataKey="orders"
                radius={[4, 4, 0, 0]}
                name="Orders"
                isAnimationActive={true}
              >
                {monthlyOrders.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
