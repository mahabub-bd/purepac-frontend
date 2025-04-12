import { getUser } from "@/actions/auth";
import { SidebarMenu } from "@/components/admin/sidebar-menu";

import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <div className="min-h-screen bg-background ">
      <SidebarMenu user={user} />
      <div className="transition-all duration-300 ease-in-out pt-1 md:pt-0 md:pl-[280px] lg:pl-[280px]">
        {children}
      </div>
    </div>
  );
}
