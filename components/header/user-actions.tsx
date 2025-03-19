"use client";

import Link from "next/link";
import { User, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBtn from "../auth/auth-button";

export default function UserActions() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const cartItemCount = 3; // Example: Replace with real cart data
  const wishlistItemCount = 5;
  const router = useRouter(); // Example: Replace with real wishlist data

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

      <AuthBtn />
    </div>
  );
}
