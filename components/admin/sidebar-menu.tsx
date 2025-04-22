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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchData } from "@/utils/api-utils";
import type { authResponse, MenuItem } from "@/utils/types";
import {
  ChevronDown,
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
import { IconRenderer } from "../common/IconRenderer";

interface UserTypes {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  profilePhoto?: {
    url?: string;
  };
}

interface SidebarProps {
  className?: string;
  user: UserTypes;
  logo?: string;
}

export function SidebarMenu({ className, logo, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMenuData = async () => {
      setIsLoading(true);
      try {
        const endpoint = user?.isAdmin
          ? "menu/tree?isAdminMenu=true&limit=50"
          : "menu/tree?isAdminMenu=false&limit=50";

        const response: MenuItem[] = await fetchData(endpoint);
        setMenuData(response);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [user?.isAdmin]);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarTitle = user?.isAdmin ? "Admin Panel" : "My Account";

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("")
      .substring(0, 2);
  };

  const toggleSubMenu = (itemName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isSubMenuActive = (item: MenuItem) => {
    if (!item?.children) return false;
    return item.children.some(
      (subItem) =>
        pathname === subItem?.url || pathname.startsWith(`${subItem?.url}/`)
    );
  };

  // Generate skeleton menu items for loading state
  const renderSkeletonMenu = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="px-2 py-1">
          <div className="flex items-center gap-2 px-3 py-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            {!collapsed && <Skeleton className="h-4 w-28" />}
          </div>
          {!collapsed && index % 2 === 0 && (
            <div className="ml-6 mt-1 border-l pl-3 space-y-1">
              {Array(Math.floor(Math.random() * 3) + 1)
                .fill(0)
                .map((_, subIndex) => (
                  <div key={`sub-${index}-${subIndex}`} className="px-3 py-1">
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
            </div>
          )}
        </div>
      ));
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30  bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden h-9 w-9 rounded-full"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className="flex h-16 items-center justify-center md:hidden fixed top-0 left-0 right-0 bg-background z-40">
        <span className="font-semibold">{sidebarTitle}</span>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 pt-8  flex flex-col border-r transition-all duration-300 ease-in-out",

          collapsed ? "w-[70px]" : "w-[250px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
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

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <div className="h-[calc(100%-3rem)] py-2">
              <div className="h-full overflow-y-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50">
                <nav className="grid gap-1 px-2">
                  {isLoading
                    ? renderSkeletonMenu()
                    : menuData?.map((item: MenuItem) => {
                        const isActive =
                          pathname === item?.url ||
                          pathname.startsWith(`${item?.url}/`);
                        const hasSubMenu =
                          item?.children && item?.children?.length > 0;
                        const isSubActive = isSubMenuActive(item);
                        const isOpen = openSubMenus[item?.name] || false;

                        return (
                          <div key={item.name} className="flex flex-col">
                            {hasSubMenu ? (
                              <button
                                onClick={() => toggleSubMenu(item.name)}
                                className={cn(
                                  "group flex h-10 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                  isActive || isSubActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "transparent",
                                  collapsed
                                    ? "justify-center"
                                    : "justify-between"
                                )}
                              >
                                <div className="flex items-center">
                                  {item.icon && (
                                    <IconRenderer
                                      name={item.icon}
                                      className={cn(
                                        "h-5 w-5 shrink-0",
                                        collapsed ? "mr-0" : "mr-2"
                                      )}
                                    />
                                  )}
                                  {!collapsed && <span>{item.name}</span>}
                                </div>
                                {!collapsed && (
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform",
                                      isOpen ? "rotate-180" : ""
                                    )}
                                  />
                                )}
                                {collapsed && (
                                  <div className="absolute left-full ml-6 hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md group-hover:flex">
                                    {item.name}
                                  </div>
                                )}
                              </button>
                            ) : (
                              <Link
                                href={item?.url}
                                className={cn(
                                  "group flex h-10 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                  isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "transparent",
                                  collapsed ? "justify-center" : "justify-start"
                                )}
                              >
                                {item.icon && (
                                  <IconRenderer
                                    name={item.icon}
                                    className={cn(
                                      "h-5 w-5 shrink-0",
                                      collapsed ? "mr-0" : "mr-2"
                                    )}
                                  />
                                )}

                                {!collapsed && <span>{item.name}</span>}
                                {collapsed && (
                                  <div className="absolute left-full ml-6 hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md group-hover:flex">
                                    {item.name}
                                  </div>
                                )}
                              </Link>
                            )}

                            {hasSubMenu && !collapsed && isOpen && (
                              <div className="ml-6 mt-1 border-l pl-3 space-y-1">
                                {item?.children.map((subItem) => {
                                  const isSubItemActive =
                                    pathname === subItem.url ||
                                    pathname.startsWith(`${subItem.url}/`);

                                  return (
                                    <Link
                                      key={subItem.name}
                                      href={subItem.url}
                                      className={cn(
                                        "flex h-8 items-center rounded-md px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isSubItemActive
                                          ? "bg-primary/5 text-primary font-medium"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {subItem.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}

                            {hasSubMenu && collapsed && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hidden absolute left-full ml-6 rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md group-hover:flex"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  side="right"
                                  align="start"
                                  className="w-48"
                                >
                                  {item?.children?.map((subItem) => (
                                    <DropdownMenuItem
                                      key={subItem.name}
                                      asChild
                                    >
                                      <Link href={subItem.url}>
                                        {subItem.name}
                                      </Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        );
                      })}
                </nav>
              </div>
            </div>
          </div>
        </div>

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
                    {user?.profilePhoto?.url && (
                      <AvatarImage
                        src={user?.profilePhoto?.url || "/placeholder.svg"}
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
                      <span className="text-sm font-medium truncate">
                        {user.name || "User"}
                      </span>
                      {user.email && (
                        <span className="text-xs text-muted-foreground truncate">
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
