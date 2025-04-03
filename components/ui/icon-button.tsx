import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

export function IconButton({ href, icon, label, count }: IconButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full p-0",
        "hover:bg-muted/50 transition-colors"
      )}
      aria-label={label}
    >
      {icon}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
