"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function IconButton({
  href,
  icon,
  label,
  count,
  onClick,
  className,
}: IconButtonProps) {
  return (
    <Link href={href} className="relative group" onClick={onClick}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full p-2 hover:bg-gray-100 transition-colors",
          className
        )}
        aria-label={label}
      >
        {icon}
      </Button>
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
