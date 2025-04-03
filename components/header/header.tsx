import Link from "next/link";
import Image from "next/image";

import NavLinks from "./nav-links";
import MobileMenu from "./mobile-menu";
import UserActions from "./user-actions";
import { PurePacLogo } from "@/public/images";
import SearchBar from "./search";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-6">
            <Image
              src={PurePacLogo || "/placeholder.svg"}
              alt="PurePac logo"
              width={120}
              height={80}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <SearchBar className="w-[320px]" />
            <UserActions />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col">
          {/* Top Row: Logo, Search Icon, User Actions */}
          <div className="flex items-center justify-between h-14 px-4">
            {/* Mobile Menu */}
            <MobileMenu />

            {/* Logo */}
            <Link href="/" className="flex items-center mx-auto">
              <Image
                src={PurePacLogo || "/placeholder.svg"}
                alt="PurePac logo"
                width={100}
                height={60}
                className="h-auto w-auto"
                priority
              />
            </Link>

            {/* User Actions (compact version) */}
            <UserActions compact />
          </div>

          {/* Bottom Row: Full Search Bar */}
          <div className="px-4 pb-2">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
