"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My Jobs", href: "/my-jobs", icon: Briefcase },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-blue-200 bg-sky-50/95 pb-safe pt-2 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]/95 md:hidden">
      <nav className="flex h-16 items-center justify-around px-4 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex w-full flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive 
                  ? "text-brand-blue dark:text-sky-400" 
                  : "text-slate-400 hover:text-brand-blue/60 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
            >
              {/* FIXED: Removed -translate-y-2 to stop it from lifting up */}
              <div className={`relative flex h-9 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-brand-blue text-white shadow-md dark:bg-sky-500/20 dark:text-sky-400 dark:shadow-none" 
                    : "bg-transparent"
              }`}>
                <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-200 group-active:scale-95" 
                />
              </div>
              
              <span className={`text-[9px] font-bold tracking-wide uppercase transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-80"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}