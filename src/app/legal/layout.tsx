"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Shield, FileText, Scale } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Terms of Service", href: "/legal/terms", icon: FileText },
    { name: "Privacy Policy", href: "/legal/privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* --- Mobile Top Navigation --- */}
      <div className="sticky top-0 z-40 block border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:hidden">
        <div className="flex items-center justify-between mb-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-blue dark:text-gray-400"
          >
            <ArrowLeft size={16} />
            Back to KaamSaathi
          </Link>
          <Scale size={20} className="text-gray-300 dark:text-zinc-600" />
        </div>
        
        {/* Mobile Tabs */}
        <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:gap-12">
          
          {/* --- Desktop Sidebar (Fixed) --- */}
          <aside className="hidden md:block md:w-64 md:shrink-0 md:py-12">
            <div className="sticky top-12">
              <Link 
                href="/" 
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-blue dark:text-gray-400"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>

              <h3 className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                Legal Documents
              </h3>
              
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-brand-blue dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-brand-blue dark:text-blue-400" : "text-gray-400"} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  Questions about these documents? <br />
                  <a href="mailto:kaamsaathiapp@gmail.com" className="font-semibold text-brand-blue hover:underline">
                    kaamsaathiapp@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* --- Main Content Area --- */}
          <main className="min-h-[80vh] flex-1 py-8 md:py-12">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800 md:p-10">
              {children}
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400 dark:border-zinc-800">
              &copy; {new Date().getFullYear()} KaamSaathi. All rights reserved.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}