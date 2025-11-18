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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-safe pt-2 dark:border-gray-800 dark:bg-black">
      <nav className="flex h-16 justify-around pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full space-y-1 ${
                isActive ? "text-brand-blue" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}