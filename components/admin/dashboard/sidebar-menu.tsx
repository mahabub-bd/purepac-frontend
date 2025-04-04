"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserTypes } from "@/utils/types";
import {
  ChevronLeft,
  Clock,
  Heart,
  HelpCircle,
  Home,
  ImageIcon,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string;
  user: UserTypes;
  logo?: string;
}

export function SidebarMenu({ className, logo, user }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const adminMenuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Brand",
      href: "/admin/brand",
      icon: Tag,
    },
    {
      name: "Category",
      href: "/admin/category",
      icon: LayoutGrid,
    },
    {
      name: "Banner",
      href: "/admin/banner",
      icon: ImageIcon,
    },
    {
      name: "Customer",
      href: "/admin/customer",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const userMenuItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Shop",
      href: "/shop",
      icon: ShoppingCart,
    },
    {
      name: "My Orders",
      href: "/orders",
      icon: Clock,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
    },
  ];

  // Select menu items based on role
  const menuItems = user?.isAdmin ? adminMenuItems : userMenuItems;
  const sidebarTitle = user?.isAdmin ? "Admin Panel" : "My Account";

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
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
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
          "fixed inset-y-0 left-0 z-30 pt-16 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between  px-4">
          <div
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full"
            )}
          >
            {collapsed ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                {user?.isAdmin ? (
                  <Package className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <User className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {logo ? (
                  <Image
                    src={logo || "/placeholder.svg"}
                    alt="Logo"
                    width={80}
                    height={40}
                    className="h-auto w-auto"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
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
        <ScrollArea className="flex-1 py-4 mt-16 md:mt-0">
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

        {user?.isAdmin && (
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                collapsed && "justify-center"
              )}
            >
              <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Logout</span>}
              {collapsed && (
                <div className="absolute left-full ml-6 hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md group-hover:flex">
                  Logout
                </div>
              )}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
