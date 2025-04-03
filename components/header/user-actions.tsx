import { Heart, ShoppingBag } from "lucide-react";

import AuthBtn from "../auth/auth-button"; // Fixed import name to match original
import { getUser } from "@/actions/auth";
import { IconButton } from "../ui/icon-button";
import { cn } from "@/lib/utils";

interface UserActionsProps {
  compact?: boolean;
}

export default async function UserActions({
  compact = false,
}: UserActionsProps) {
  const user = await getUser();
  const cartItemCount = 3; // Example: Replace with real cart data
  const wishlistItemCount = 5;

  return (
    <div className={cn("flex items-center gap-1", compact ? "gap-0" : "gap-2")}>
      {/* Wishlist Button with Badge */}
      {!compact && (
        <IconButton
          href="/wishlist"
          icon={
            <Heart className="size-[22px] text-gray-700 group-hover:text-primary transition-colors" />
          }
          label="Wishlist"
          count={wishlistItemCount}
        />
      )}

      {/* Cart Button with Badge */}
      <IconButton
        href="/cart"
        icon={
          <ShoppingBag
            className={cn(
              "text-gray-700 group-hover:text-primary transition-colors",
              compact ? "size-5" : "size-[22px]"
            )}
          />
        }
        label={compact ? "" : "Cart"}
        count={cartItemCount}
      />

      <AuthBtn user={user} compact={compact} />
    </div>
  );
}
