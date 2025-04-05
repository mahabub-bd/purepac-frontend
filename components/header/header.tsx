import { getUser } from "@/actions/auth";
import { PurePacLogo } from "@/public/images";
import { UserTypes } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import { NavLinks } from "./nav-links";
import SearchBar from "./search";
import UserActions from "./user-actions";

export async function Header() {
  const user: UserTypes = await getUser();
  const isAdminUser = user?.isAdmin;

  return (
    <header className="sticky border-b top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="hidden md:flex items-center justify-between py-1 container mx-auto  ">
        <Link
          href={isAdminUser ? "/admin/dashboard" : "/"}
          className="flex items-center mr-6"
        >
          <Image
            src={PurePacLogo}
            alt="PurePac logo"
            width={120}
            height={80}
            className="h-auto w-auto"
            priority
          />
        </Link>

        <nav className={`flex items-center space-x-8 ${"ml-20"}`}>
          <NavLinks isAdmin={isAdminUser} />
        </nav>
        {/* Search and User Actions */}
        <div className="flex items-center space-x-4">
          {!isAdminUser && <SearchBar className="w-[320px]" />}
          <UserActions compact={false} />
        </div>
      </div>

      <div className="md:hidden flex flex-col">
        <div className="flex items-center justify-between h-14 px-4">
          <MobileMenu isAdmin={isAdminUser} />

          {/* Logo */}
          <Link
            href={isAdminUser ? "/admin/dashboard" : "/"}
            className="flex items-center mx-auto"
          >
            <Image
              src={PurePacLogo}
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

        {!isAdminUser && (
          <div className="px-4 pb-2">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
