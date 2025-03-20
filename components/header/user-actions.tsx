"use client";

import { Heart, ShoppingBag } from "lucide-react";
import AuthBtn from "../auth/auth-button";
import { IconButton } from "../ui/icon-button";

interface UserActionsProps {
  isMobile?: boolean;
}

export default function UserActions({ isMobile = false }: UserActionsProps) {
  // Example: Replace with real data from your state management
  const cartItemCount = 3;
  const wishlistItemCount = 5;

  return (
    <div
      className={`flex items-center ${
        isMobile ? "justify-between w-full" : "space-x-4"
      }`}
    >
      {/* Wishlist Button with Badge */}
      <IconButton
        href="/wishlist"
        icon={
          <Heart className="size-6 text-gray-700 group-hover:text-primary" />
        }
        label="Wishlist"
        count={wishlistItemCount}
      />

      {/* Cart Button with Badge */}
      <IconButton
        href="/cart"
        icon={
          <ShoppingBag className="size-6 text-gray-700 group-hover:text-primary" />
        }
        label="Cart"
        count={cartItemCount}
      />

      {/* User Account Button/Dropdown */}
      <AuthBtn />
    </div>
  );
}
