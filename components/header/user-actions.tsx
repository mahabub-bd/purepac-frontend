import { getUser } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { fetchProtectedData } from "@/utils/api-utils";
import { Cart } from "@/utils/types";
import { HeartIcon } from "lucide-react";
import AuthBtn from "../auth/auth-button";

import { CartButtonHeader } from "../cart/cart-button-header";
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
  const cart = user ? await fetchProtectedData<Cart>("cart") : null;

  const wishlistItemCount = 5;

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "gap-1" : "gap-3",
        className
      )}
    >
      {!compact && (
        <IconButton
          icon={
            <HeartIcon className="size-[18px] text-gray-700 group-hover:text-primary transition-colors duration-200" />
          }
          label="Wishlist"
          count={wishlistItemCount}
        />
      )}
      <CartButtonHeader cart={cart ?? undefined} compact={compact} />
      {/* Auth Button */}
      <AuthBtn
        user={user}
        compact={compact}
        className={cn(compact ? "ml-1" : "ml-2")}
      />
    </div>
  );
}
