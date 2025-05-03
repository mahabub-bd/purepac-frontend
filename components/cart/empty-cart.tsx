import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyCart({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">Your cart is empty</h3>
        <p className="text-muted-foreground">Add items to get started</p>
      </div>
      <Button asChild variant="secondary" onClick={onClose}>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
