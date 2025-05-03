import { Button } from "@/components/ui/button";
import { formatCurrencyEnglish } from "@/lib/utils";
import { CartItem } from "@/utils/types";
import Image from "next/image";

export function CartItemProduct({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item?.product?.attachment?.url || "/placeholder.svg"}
          alt={item.product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="font-medium">
            {formatCurrencyEnglish(item.product.sellingPrice * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 px-0"
              onClick={onRemove}
            >
              ×
            </Button>
            <span>Qty: {item.quantity}</span>
          </div>
          <button
            onClick={onRemove}
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
