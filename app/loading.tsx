import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 w-screen h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading ...</p>
      </div>
    </div>
  );
}
