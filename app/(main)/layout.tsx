import { Header } from "@/components/header";
import type React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
