import { getUser } from "@/actions/auth";
import { AdminHeader } from "@/components/admin/admin-header";

import { SidebarMenu } from "@/components/admin/sidebar-menu";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration panel for managing the application",
  keywords: ["admin", "dashboard", "management"],
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-background">
      <SidebarMenu user={user} />
      <div className="transition-all duration-300 ease-in-out pt-1 md:pt-0 md:pl-[250px] lg:pl-[260px]">
        <AdminHeader user={user} />
        <main className="md:p-8 p-2">{children}</main>
      </div>
    </div>
  );
}
