import { getUser } from "@/actions/auth";

import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/providers/cart-provider";
import { fetchProtectedData } from "@/utils/api-utils";
import { Cart } from "@/utils/types";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Pure Pac",
    template: "%s | Pure Pac", // This will add prefix to child page titles
  },
  description: "Premium ecommerce for quality products",
  keywords: ["ecommerce", "shopping", "online store", "Pure Pac"],
  authors: [{ name: "Pure Pac Team" }],
  creator: "Pure Pac",
  publisher: "Pure Pac",

  // Open Graph (Facebook & LinkedIn)
  openGraph: {
    title: "Pure Pac",
    description: "Premium ecommerce for quality products",
    url: "https://yourdomain.com",
    siteName: "Pure Pac",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Pure Pac - Premium Ecommerce",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Pure Pac",
    description: "Premium ecommerce for quality products",
    images: ["https://yourdomain.com/twitter-image.jpg"], // Replace with your Twitter image
    creator: "@purepacofficial", // Your Twitter handle
  },

  // Favicons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  metadataBase: new URL("https://purepacbd.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const cart = user ? await fetchProtectedData<Cart>("cart") : null;
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors />
        <CartProvider serverCart={cart ?? undefined} isLoggedIn={!!user}>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
