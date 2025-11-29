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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-safe pt-1 dark:border-zinc-800 dark:bg-zinc-900">
      <nav className="flex h-16 items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex w-full flex-col items-center justify-center space-y-1 py-1 transition-colors ${
                isActive 
                  ? "text-brand-blue dark:text-white" 
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              <div className={`relative flex h-9 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive ? "bg-brand-blue/10 dark:bg-zinc-800" : "bg-transparent"
              }`}>
                <item.icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-200 group-active:scale-95" 
                />
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}