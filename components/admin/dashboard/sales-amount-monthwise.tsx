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
import { formatCurrencyEnglish } from "@/lib/utils";
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

type SalesData = {
  month: string;
  salesAmount: number;
};

const monthlySales: SalesData[] = [
  { month: "Jan", salesAmount: 45000 },
  { month: "Feb", salesAmount: 52000 },
  { month: "Mar", salesAmount: 38000 },
  { month: "Apr", salesAmount: 41000 },
  { month: "May", salesAmount: 48000 },
  { month: "Jun", salesAmount: 55000 },
  { month: "Jul", salesAmount: 49000 },
  { month: "Aug", salesAmount: 58000 },
  { month: "Sep", salesAmount: 53000 },
  { month: "Oct", salesAmount: 62000 },
  { month: "Nov", salesAmount: 57000 },
  { month: "Dec", salesAmount: 68000 },
];

const SALES_COLORS = [
  "hsl(0, 65%, 65%)", // January - Red
  "hsl(30, 65%, 65%)", // February - Orange
  "hsl(60, 65%, 65%)", // March - Yellow
  "hsl(90, 65%, 65%)", // April - Lime
  "hsl(120, 65%, 65%)", // May - Green
  "hsl(150, 65%, 65%)", // June - Teal
  "hsl(180, 65%, 65%)", // July - Cyan
  "hsl(210, 65%, 65%)", // August - Sky Blue
  "hsl(240, 65%, 65%)", // September - Blue
  "hsl(270, 65%, 65%)", // October - Purple
  "hsl(300, 65%, 65%)", // November - Pink
  "hsl(330, 65%, 65%)", // December - Rose
];

export default function SalesAmountMonthwise() {
  const chartConfig = monthlySales.reduce((config, item, index) => {
    config[item.month] = {
      label: item.month,
      color: SALES_COLORS[index],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Month-Wise Sales Amount</CardTitle>
        <CardDescription>
          Total sales of{" "}
          {formatCurrencyEnglish(
            monthlySales.reduce((sum, item) => sum + item.salesAmount, 0)
          )}{" "}
          this year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart
              accessibilityLayer
              data={monthlySales}
              margin={{
                top: 20,
                right: 15,
                left: 25,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Bar
                dataKey="salesAmount"
                radius={[4, 4, 0, 0]}
                name="Sales Amount"
                isAnimationActive={true}
              >
                {monthlySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SALES_COLORS[index]} />
                ))}
                <LabelList
                  dataKey="salesAmount"
                  position="top"
                  style={{
                    fill: "#1f2937",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                  formatter={(value: number) => formatCurrencyEnglish(value)}
                />
              </Bar>
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
