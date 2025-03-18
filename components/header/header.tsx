"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import NavLinks from "./nav-links";
import MobileMenu from "./mobile-menu";
import UserActions from "./user-actions";
import { PurePacLogo } from "@/public/images";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex items-center justify-between mx-auto px-4 md:py-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={PurePacLogo} alt="Company logo" width={120} height={80} />
        </Link>

        {/* Desktop Navigation and Search */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-6">
            <NavLinks />
          </nav>

          {/* Search Bar - Desktop */}
          <SearchBar className="ml-4 md:w-[500px]" />
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:block">
          <UserActions />
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <MobileMenu />
      </div>

      {/* Mobile Search and Actions */}
      <div className="container flex items-center justify-between mx-auto px-4 py-2 md:hidden">
        {/* Search Bar - Mobile */}
        <SearchBar className="flex-1 mr-4" />

        {/* User Actions - Mobile */}
        <UserActions />
      </div>
    </header>
  );
}

function SearchBar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full rounded-md pl-8"
      />
    </div>
  );
}
