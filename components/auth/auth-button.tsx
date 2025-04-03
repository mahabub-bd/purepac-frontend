"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserTypes } from "@/utils/types";
import { LogOut, Settings, User, UserCircle, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthBtnProps {
  user: UserTypes | null;
  compact?: boolean;
}

export default function AuthBtn({ user, compact = false }: AuthBtnProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative rounded-full border p-0 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0",
                compact ? "h-8 w-8" : "h-9 w-9"
              )}
              disabled={isLoggingOut}
              aria-label="User menu"
            >
              <Avatar className={cn(compact ? "h-8 w-8" : "h-9 w-9")}>
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : null}
                <AvatarFallback
                  className={cn(
                    "text-xs font-medium",
                    compact ? "text-[10px]" : "text-xs"
                  )}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                {user.email && (
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex cursor-pointer items-center"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex cursor-pointer items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              {compact && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/wishlist"
                    className="flex cursor-pointer items-center"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant={compact ? "ghost" : "outline"}
          size="sm"
          className={cn(
            compact
              ? "h-8 w-8 p-0 rounded-full"
              : "flex items-center gap-2 rounded-full px-4"
          )}
          onClick={() => router.push("/auth/sign-in")}
        >
          <User className={cn(compact ? "h-5 w-5" : "h-4 w-4")} />
          {!compact && <span>Sign in</span>}
          <span className="sr-only">Sign in</span>
        </Button>
      )}
    </>
  );
}
