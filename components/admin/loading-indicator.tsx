import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  iconSize?: number;
  containerClassName?: string;
}

export function LoadingIndicator({
  message = "Loading...",
  className = "",
  iconSize = 4,
  containerClassName = "py-12",
}: LoadingIndicatorProps) {
  return (
    <div className={`flex justify-center items-center ${containerClassName}`}>
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <Loader2
          className={`h-${iconSize} w-${iconSize} animate-spin text-primary`}
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
