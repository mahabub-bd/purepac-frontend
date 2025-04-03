import Link from "next/link";
import Image from "next/image";

import NavLinks from "./nav-links";
import MobileMenu from "./mobile-menu";
import UserActions from "./user-actions";
import { PurePacLogo } from "@/public/images";
import SearchBar from "./search";

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
