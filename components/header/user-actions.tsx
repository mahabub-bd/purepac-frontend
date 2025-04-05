import { Heart, ShoppingBag } from "lucide-react";

import { getUser } from "@/actions/auth";
import { cn } from "@/lib/utils";
import AuthBtn from "../auth/auth-button"; // Fixed import name to match original
import { IconButton } from "../ui/icon-button";

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

      <AuthBtn user={user} compact className="custom-class" />
    </div>
  );
}
