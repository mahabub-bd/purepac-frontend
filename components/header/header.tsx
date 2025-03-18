"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, User, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./nav-links";
import Image from "next/image";
import { PurePacLogo } from "@/public/images";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex items-center justify-between mx-auto px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={PurePacLogo} alt="purepaclogo" width={100} height={80} />
        </Link>

        {/* Desktop Navigation and User Actions */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <NavLinks />
          </nav>

          {/* Search Bar */}
          <div className="relative ml-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-md pl-8 md:w-[500px]"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* Wishlist Button */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Account Button */}
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-4">
            <nav className="flex flex-col space-y-6 pt-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={PurePacLogo}
                  alt="purepaclogo"
                  width={100}
                  height={80}
                />
              </Link>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <NavLinks isMobile />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="container flex items-center justify-between mx-auto px-4 py-2 md:hidden">
        {/* Search Bar */}
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-md pl-8"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {/* Cart Button */}
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* Wishlist Button */}
          <Link href="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          {/* Account Button */}
          <Link href="/auth/sign-in">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
