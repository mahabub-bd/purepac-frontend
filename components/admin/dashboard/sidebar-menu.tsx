"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Tag,
  LayoutGrid,
  ImageIcon,
  Users,
  ChevronLeft,
  Menu,
  X,
  Home,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import Image from "next/image";
import { PurePacLogo } from "@/public/images";

interface SidebarProps {
  className?: string;
}

export function SidebarMenu({ className }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menuItems = [
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

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
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

      {/* Add a proper header for mobile view */}
      <div className="flex h-16 items-center justify-center border-b md:hidden fixed top-0 left-0 right-0 bg-background z-40">
        <span className="font-semibold">Admin Panel</span>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full"
            )}
          >
            {collapsed ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : (
              <Image
                src={PurePacLogo || "/placeholder.svg"}
                alt="Logo"
                width={80}
                height={40}
                className="h-auto w-auto"
              />
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
      </aside>
    </>
  );
}
