import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

import AuthBtn from "../auth/auth-button";
import { getUser } from "@/actions/auth";

export default async function UserActions() {
  const user = await getUser();
  const cartItemCount = 3; // Example: Replace with real cart data
  const wishlistItemCount = 5;

  return (
    <div className="flex items-center space-x-4">
      {/* Wishlist Button with Badge */}
      <Link href="/wishlist" className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="size-6 text-gray-700 group-hover:text-primary" />
        </Button>
        {wishlistItemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {wishlistItemCount}
          </span>
        )}
      </Link>

      {/* Cart Button with Badge */}
      <Link href="/cart" className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag className="size-6 text-gray-700 group-hover:text-primary" />
        </Button>
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {cartItemCount}
          </span>
        )}
      </Link>

      {/* User Account Dropdown */}

      <AuthBtn user={user} />
    </div>
  );
}
