import {
  Clock,
  Heart,
  HelpCircle,
  Home,
  ImageIcon,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  User,
  Users,
  UsersRound,
} from "lucide-react";

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
    name: "User",
    href: "/admin/user",
    icon: UsersRound,
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

export { adminMenuItems, userMenuItems };
