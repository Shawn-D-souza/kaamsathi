"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User as UserIcon, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import NotificationBell from "./NotificationBell"; // IMPORT ADDED

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname();
  const [isSeeker, setIsSeeker] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const supabase = createClient();

  const isLanding = !user;

  // Dynamic Styles
  const headerClass = isLanding
    ? "bg-brand-blue border-white/10 shadow-blue-900/5 dark:bg-[#0f172a] dark:border-slate-800"
    : "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm dark:bg-[#0f172a]/95 dark:border-slate-800";

  const textClass = isLanding
    ? "text-white"
    : "text-slate-900 dark:text-white";

  const mutedTextClass = isLanding
    ? "text-white/70 hover:text-white"
    : "text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white";

  const activeIconClass = isLanding
    ? "fill-white/20"
    : "fill-brand-blue/20 text-brand-blue";

  const logoBorderClass = isLanding
    ? "border-white/20"
    : "border-slate-200 dark:border-slate-700";

  const profileButtonClass = isLanding
    ? "bg-white/10 text-white hover:bg-white/20 border-white/10"
    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        setIsSeeker(data?.role === "seeker");
      }
    };

    if (!user || (user && !isSeeker)) {
       fetchUser();
    }

    const handleRoleUpdate = (event: CustomEvent) => {
      setIsSeeker(event.detail === "seeker");
    };
    window.addEventListener("role-updated", handleRoleUpdate as EventListener);
    return () => {
      window.removeEventListener("role-updated", handleRoleUpdate as EventListener);
    };
  }, [supabase, user, isSeeker]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My Jobs", href: "/my-jobs", icon: Briefcase },
    { name: "Messages", href: "/messages", icon: MessageSquare },
  ];

  return (
    <header className={`fixed top-0 left-0 z-50 hidden w-full border-b shadow-lg md:block transition-colors duration-200 ${headerClass}`}>
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        <div className="flex items-center gap-10">
          <Link href="/" className={`flex items-center gap-2 text-2xl font-extrabold tracking-tight ${textClass}`}>
             <div className={`relative h-8 w-8 overflow-hidden rounded-lg shadow-md border ${logoBorderClass}`}>
              <Image 
                src="/logo.png" 
                alt="KaamSaathi" 
                fill 
                className="object-cover"
                priority
              />  
            </div>
            KaamSaathi
          </Link>
          
          {user && (
            <nav className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive
                        ? `${textClass} opacity-100`
                        : mutedTextClass
                    }`}
                  >
                    <item.icon size={18} className={isActive ? activeIconClass : ""} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          
          {user && <NotificationBell userId={user.id} />}

          {user ? (
            <Link 
              href="/profile"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all border ${profileButtonClass}`}
            >
              <UserIcon size={20} />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-colors"
            >
              <LogIn size={18} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}