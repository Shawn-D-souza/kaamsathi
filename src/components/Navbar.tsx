"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [isSeeker, setIsSeeker] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // 1. Initial Fetch
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsSeeker(data?.role === "seeker");
      }
    };
    fetchRole();

    // 2. Custom Event Listener (For instant updates from Profile Page)
    const handleRoleUpdate = (event: CustomEvent) => {
      setIsSeeker(event.detail === "seeker");
    };

    window.addEventListener("role-updated", handleRoleUpdate as EventListener);

    return () => {
      window.removeEventListener("role-updated", handleRoleUpdate as EventListener);
    };
  }, [supabase]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My Jobs", href: "/my-jobs", icon: Briefcase },
    { name: "Messages", href: "/messages", icon: MessageSquare },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 hidden w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/95 md:block">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold text-brand-blue tracking-tight">
            KaamSaathi
          </Link>
          
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* This button will now appear/disappear instantly */}
          {isSeeker && (
            <Link
              href="/jobs/new"
              className="flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition-transform hover:opacity-90 active:scale-95"
            >
              <Plus size={18} />
              <span>Post Job</span>
            </Link>
          )}

          <Link 
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:ring-2 hover:ring-brand-blue/20 dark:bg-zinc-800 dark:text-gray-300"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}