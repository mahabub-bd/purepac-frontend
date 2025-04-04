"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinksProps {
  isAdmin?: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

export function NavLinks({ isAdmin, isMobile, onClick }: NavLinksProps) {
  // Common links for all users
  const commonLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Regular user links
  const userLinks = [
    { href: "/products", label: "Products" },
    { href: "/services", label: "Services" },
  ];

  // Admin-specific links
  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
  ];

  // Combine links based on user role
  const links = isAdmin
    ? [...commonLinks, ...adminLinks]
    : [...commonLinks, ...userLinks];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isMobile ? "block py-2" : ""
          )}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
