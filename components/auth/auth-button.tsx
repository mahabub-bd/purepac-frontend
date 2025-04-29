"use client";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage ,} from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import type { authResponse, UserTypes } from "@/utils/types";
import { Heart, LogOut, Settings, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AuthBtnProps {
  user: UserTypes | null;
  compact?: boolean;
  className?: string;
}

export default function AuthBtn({
  user,
  compact = false,
  className,
}: AuthBtnProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result: authResponse = await logout();
      console.log("Logout result:", result); // Debugging line

      if (result.statusCode === 200) {
        toast.success("Logged out successfully");
        router.push("/auth/sign-in");
        router.refresh(); // Ensure client state updates
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("")
      .substring(0, 2);
  };

  if (!user) {
    return (
      <Button
        variant={compact ? "ghost" : "default"}
        size="sm"
        className={cn(
          compact
            ? "h-8 w-8 rounded-full p-0"
            : "flex items-center gap-2 rounded-full px-4",
          className
        )}
        onClick={() => router.push("/auth/sign-in")}
        aria-label="Sign in"
      >
        <User className={cn("h-4 w-4", compact ? "" : "mr-1")} />
        {!compact && <span>Sign in</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative rounded-full border p-0 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0",
            compact ? "h-8 w-8" : "h-9 w-9",
            className
          )}
          disabled={isLoggingOut}
          aria-label="User menu"
        >
        <Avatar className={cn(compact ? "h-8 w-8" : "h-9 w-9")}>
  {user?.profilePhoto?.url ? (
    <AvatarImage
      src={user.profilePhoto.url}
      alt={user.name || "User avatar"}
      className="object-cover"
      referrerPolicy="no-referrer"
    />
  ) : null}
  <AvatarFallback
    className={cn(
      "text-xs font-medium",
      compact ? "text-[10px]" : "text-xs"
    )}
  >
    {user.name ? getInitials(user.name) : "US"}
  </AvatarFallback>
</Avatar>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        onCloseAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {user.name || "User"}
            </p>
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
              prefetch={false}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={user?.isAdmin ? "/admin/dashboard" : "/user/dashboard"}
              className="flex cursor-pointer items-center"
              prefetch={false}
            >
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          {compact && (
            <DropdownMenuItem asChild>
              <Link
                href="/wishlist"
                className="flex cursor-pointer items-center"
                prefetch={false}
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
          className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
