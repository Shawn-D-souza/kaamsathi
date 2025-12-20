import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackButtonHandler from "@/components/BackButtonHandler";
import OfflineBanner from "@/components/OfflineBanner";
import { createClient } from "@/utils/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 transition-colors duration-200 dark:bg-black dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Native hardware integration */}
          <BackButtonHandler />
          
          {/* Offline Notification */}
          <OfflineBanner />

          {/* Top Navigation (Desktop) */}
          <Navbar />

          {/* Main Layout 
              - FIXED: Removed md:pt-16 so Landing Page has NO GAP.
              - Pages that need space (like Dashboard) must add their own padding.
          */}
          <div className="min-h-screen w-full bg-[var(--background)] transition-colors duration-200 pt-0">
            
            {/* Main Content 
                - pb-24: Adds padding at bottom ONLY if user is logged in (for BottomNav)
            */}
            <main className={`min-h-screen ${user ? 'pb-24 md:pb-12' : ''}`}>
              {children}
            </main>
            
            {/* Bottom Navigation (Mobile) - Only visible when logged in */}
            {user && <BottomNav />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}