import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100`}
      >
        <div className="mx-auto min-h-screen w-full max-w-md bg-white shadow-2xl shadow-black/5 dark:bg-black dark:shadow-none sm:border-x sm:border-gray-100 dark:sm:border-zinc-800">
          <main className="min-h-screen pb-24">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}