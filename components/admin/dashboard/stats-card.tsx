import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type ColorScheme = "blue" | "purple" | "green" | "amber" | "pink" | "indigo";
type TrendDirection = "up" | "down" | "neutral";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: TrendDirection;
  icon: LucideIcon;
  colorScheme?: ColorScheme;
  className?: string;
}

const COLOR_SCHEMES: Record<
  ColorScheme,
  {
    card: string;
    icon: string;
    trend: Record<TrendDirection, string>;
  }
> = {
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    trend: {
      up: "text-blue-700 dark:text-blue-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20",
    icon: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    trend: {
      up: "text-purple-700 dark:text-purple-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
  green: {
    card: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20",
    icon: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    trend: {
      up: "text-green-700 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
  amber: {
    card: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    trend: {
      up: "text-amber-700 dark:text-amber-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
  pink: {
    card: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/20",
    icon: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    trend: {
      up: "text-pink-700 dark:text-pink-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/20",
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    trend: {
      up: "text-indigo-700 dark:text-indigo-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-500 dark:text-gray-400",
    },
  },
};

const TREND_ICONS: Record<TrendDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

const TREND_COLORS: Record<TrendDirection, string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  neutral: "text-gray-500",
};

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  colorScheme = "blue",
  className,
}: StatsCardProps) {
  const colors = COLOR_SCHEMES[colorScheme];
  const TrendIcon = TREND_ICONS[trend];

  return (
    <Card className={cn("border-none shadow-sm", colors.card, className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            colors.icon
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs flex items-center mt-1">
          <TrendIcon className={cn("h-3 w-3 mr-1", TREND_COLORS[trend])} />
          <span className={colors.trend[trend]}>{description}</span>
        </p>
      </CardContent>
    </Card>
  );
}
