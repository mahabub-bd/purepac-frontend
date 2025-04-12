import { Category, Role } from "@/utils/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyEnglish(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
}

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka", // GMT+6
  });
};

export const roleColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [Role.CUSTOMER]: "outline",
  [Role.ADMIN]: "default",
  [Role.SUPERADMIN]: "destructive",
  [Role.EDITOR]: "secondary",
  [Role.MODERATOR]: "secondary",
};

export function getTopCategoryByProductCount(
  categories: Category[]
): string | null {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const topCategory = categories.reduce((top, current) => {
    const currentCount = current.products?.length || 0;
    const topCount = top.products?.length || 0;
    return currentCount > topCount ? current : top;
  });

  return topCategory?.name || null;
}
