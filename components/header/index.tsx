import { getUser } from "@/actions/auth";
import type { UserTypes } from "@/utils/types";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";

export async function Header() {
  const user: UserTypes = await getUser();
  const isAdminUser = user?.isAdmin;

  return (
    <header className="sticky border-b top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <DesktopHeader isAdminUser={isAdminUser} />
      <MobileHeader isAdminUser={isAdminUser} />
    </header>
  );
}
