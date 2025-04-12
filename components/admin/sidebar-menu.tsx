"use client";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adminMenuItems, userMenuItems } from "@/constants";
import { cn } from "@/lib/utils";
import { AvatarImageIcon } from "@/public/images";
import type { authResponse, UserTypes } from "@/utils/types";
import {
  ChevronLeft,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
  UserCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SidebarProps {
  className?: string;
  user: UserTypes;
  logo?: string;
}

export function SidebarMenu({ className, logo, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result: authResponse = await logout();

      if (result.statusCode === 200) {
        toast.success("Logged out successfully");
        router.push("/auth/sign-in");
        router.refresh();
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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menuItems = user?.isAdmin ? adminMenuItems : userMenuItems;
  const sidebarTitle = user?.isAdmin ? "Admin Panel" : "My Account";

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("")
      .substring(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden h-9 w-9 rounded-full"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-center md:hidden fixed top-0 left-0 right-0 bg-background z-40">
        <span className="font-semibold">{sidebarTitle}</span>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 pt-4 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4">
          <div
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full"
            )}
          >
            {collapsed ? (
              <div className="flex items-center justify-center rounded-md bg-primary">
                {user?.isAdmin ? (
                  <Package className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <User className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2">
                {logo ? (
                  <Image
                    src={logo || "/placeholder.svg"}
                    alt="Logo"
                    width={80}
                    height={40}
                    className="h-auto w-auto"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary py-3">
                    {user?.isAdmin ? (
                      <Package className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <User className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>
                )}
                <span className="font-medium">{sidebarTitle}</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex h-10 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "transparent",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      collapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-6 hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md group-hover:flex">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Profile Dropdown (replacing the logout button) */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-accent",
                  collapsed && "justify-center px-0"
                )}
              >
                <div
                  className={cn(
                    "flex items-center",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <Avatar
                    className={cn("h-8 w-8", collapsed ? "mr-0" : "mr-2")}
                  >
                    {user.image && (
                      <AvatarImage
                        src={user.image || AvatarImageIcon}
                        alt={user.name || "User avatar"}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <AvatarFallback className="text-xs font-medium">
                      {user.name ? getInitials(user.name) : "US"}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium truncate ">
                        {user.name || "User"}
                      </span>
                      {user.email && (
                        <span className="text-xs text-muted-foreground truncate ">
                          {user.email}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={collapsed ? "center" : "end"}
              className="w-56"
              side={collapsed ? "right" : "top"}
              sideOffset={collapsed ? 16 : 0}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  {user.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
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
        </div>
      </aside>
    </>
  );
}
