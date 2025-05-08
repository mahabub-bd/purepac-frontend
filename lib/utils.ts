import { Brand, Category } from "@/utils/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyEnglish(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("BDT", "৳ ");
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
// Add to your utils file if not already present
export function getTopBrandByProductCount(brands?: Brand[]): string {
  if (!brands || brands.length === 0) return "None";
  const sorted = [...brands].sort(
    (a, b) => (b.products?.length || 0) - (a.products?.length || 0)
  );
  return sorted[0].name;
}
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const roleColors: Record<string, string> = {
  admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  customer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  staff:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  storemanager:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  superadmin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export const getRoleColor = (roleName: string | undefined) => {
  if (!roleName) return roleColors.default;
  const normalizedRole = roleName.toLowerCase();
  return roleColors[normalizedRole] || roleColors.default;
};
