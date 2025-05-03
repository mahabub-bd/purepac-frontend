// components/ui/icon-button.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface IconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  count?: number;
  alwaysShowCount?: boolean;
}

export const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  (
    { icon, label, count, alwaysShowCount = false, className, ...props },
    ref
  ) => {
    const showCount =
      typeof count === "number" && (alwaysShowCount ? count >= 0 : count > 0);

    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex h-9 w-9 items-center justify-center rounded-full p-0",
          "hover:bg-muted/50 transition-colors cursor-pointer",
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
        {showCount && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    );
  }
);

IconButton.displayName = "IconButton";
