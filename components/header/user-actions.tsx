import { getUser } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import AuthBtn from "../auth/auth-button";
import { IconButton } from "../ui/icon-button";

interface UserActionsProps {
  compact?: boolean;
  className?: string;
}

export default async function UserActions({
  compact = false,
  className,
}: UserActionsProps) {
  const user = await getUser();

  const cartItemCount = 3; // Example: Replace with real cart data
  const wishlistItemCount = 5;

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "gap-1" : "gap-3",
        className
      )}
    >
      {/* Wishlist Button with Badge */}
      {!compact && (
        <IconButton
          href="/wishlist"
          icon={
            <HeartIcon className="size-[18px] text-gray-700 group-hover:text-primary transition-colors duration-200" />
          }
          label="Wishlist"
          count={wishlistItemCount}
        />
      )}

      {/* Cart Button with Badge */}
      <IconButton
        href="/cart"
        icon={
          <ShoppingCartIcon
            className={cn(
              "text-gray-700 group-hover:text-primary transition-colors duration-200",
              compact ? "size-[18px]" : "size-[18px]"
            )}
          />
        }
        label={compact ? "" : "Cart"}
        count={cartItemCount}
      />

      {/* Auth Button */}
      <AuthBtn
        user={user}
        compact={compact}
        className={cn(compact ? "ml-1" : "ml-2")}
      />
    </div>
  );
}
