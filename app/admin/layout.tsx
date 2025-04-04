
import { SidebarMenu } from "@/components/admin/dashboard/sidebar-menu";
import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background ">
      <SidebarMenu />
      <div className="transition-all duration-300 ease-in-out pt-1 md:pt-0 md:pl-[250px] lg:pl-[250px]">
        {children}
      </div>
    </div>
  );
}
