import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import BackButtonHandler from "@/components/BackButtonHandler";

import { createClient } from "@/utils/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaamSaathi",
  description: "Peer-to-peer job marketplace",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#005A9C",
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout
 * The primary layout wrapper for the KaamSaathi application.
 * Handles global font variables, theme providers, and core navigation.
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased bg-white text-gray-900 
          transition-colors duration-200 
          dark:bg-black dark:text-gray-100
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Native hardware integration */}
          <BackButtonHandler />
          
          <Navbar />

          <div className="min-h-screen w-full bg-[var(--background)] transition-colors duration-200">
            <main className="min-h-screen">
              {children}
            </main>
            
            {user && <BottomNav />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}