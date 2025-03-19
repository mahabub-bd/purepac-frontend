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

export default function UserActions() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const cartItemCount = 3; // Example: Replace with real cart data
  const wishlistItemCount = 5; // Example: Replace with real wishlist data

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Account"
          >
            <User className="size-6 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-900">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-t border-gray-200" />
          {isSignedIn ? (
            <>
              <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Orders
              </DropdownMenuItem>

              <DropdownMenuSeparator className="border-t border-gray-200" />
              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsSignedIn(false)}
              >
                Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsSignedIn(true)}
              >
                Sign in
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Register
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
