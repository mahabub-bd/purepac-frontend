import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";

import { Header } from "@/components/header/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication System",
  description: "A modern authentication system with multiple sign-in methods",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="min-h-screen ">{children}</div>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
