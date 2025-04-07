import { PurePacLogo } from "@/public/images";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import SearchBar from "./search";
import UserActions from "./user-actions";

interface MobileHeaderProps {
  isAdminUser: boolean;
}

export function MobileHeader({ isAdminUser }: MobileHeaderProps) {
  return (
    <div className="md:hidden flex flex-col">
      <div className="flex items-center justify-between py-2 px-4">
        <MobileMenu isAdmin={isAdminUser} />

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

        <UserActions compact />
      </div>

      {!isAdminUser && (
        <div className="px-4 pb-2">
          <SearchBar />
        </div>
      )}
    </div>
  );
}
