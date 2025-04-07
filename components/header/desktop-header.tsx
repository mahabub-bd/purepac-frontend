import { PurePacLogo } from "@/public/images";
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./nav-links";
import SearchBar from "./search";
import UserActions from "./user-actions";

interface DesktopHeaderProps {
  isAdminUser: boolean;
}

export function DesktopHeader({ isAdminUser }: DesktopHeaderProps) {
  return (
    <div className="hidden md:flex items-center justify-between py-2 container mx-auto">
      <div className="flex items-center">
        <Link href="/" className="flex items-center mr-6">
          <Image
            src={PurePacLogo || "/placeholder.svg"}
            alt="PurePac logo"
            width={120}
            height={80}
           
            priority
          />
        </Link>

        <nav className="flex items-center space-x-8 ml-20">
          <NavLinks isAdmin={isAdminUser} />
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {!isAdminUser && <SearchBar className="w-[320px]" />}
        <UserActions compact={false} />
      </div>
    </div>
  );
}
