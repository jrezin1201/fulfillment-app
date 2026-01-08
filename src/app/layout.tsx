import React from "react";
import "./globals.css";
import "./theme.css";
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site-config";
import { NavBar } from "@/components/layout/NavBar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - Kit Manufacturing & Fulfillment`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
