import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {/* Top Navigation (Desktop) */}
          <Navbar />

          {/* Main Layout */}
          <div className="min-h-screen w-full bg-[var(--background)] transition-colors duration-200 pt-0 md:pt-16">
            <main className="min-h-screen pb-24 md:pb-12">
              {children}
            </main>
            
            {/* Bottom Navigation (Mobile) */}
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}