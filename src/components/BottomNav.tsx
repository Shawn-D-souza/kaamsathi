"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User, Plus, Zap, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [isSeeker, setIsSeeker] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsSeeker(data?.role === "seeker");
      }
    };
    fetchUser();

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
    <header className="fixed top-0 left-0 z-50 hidden w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:bg-[#020817]/80 dark:border-slate-800 md:block">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        {/* Logo & Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue text-white shadow-lg shadow-blue-500/20">
              <Zap size={18} fill="currentColor" />
            </div>
            KaamSaathi
          </Link>
          
          {user && (
            <nav className="flex items-center gap-1 rounded-full bg-slate-100/50 p-1 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-brand-blue shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isSeeker && (
                <Link
                  href="/jobs/new"
                  className="group flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-brand-blue hover:-translate-y-0.5 active:scale-95 dark:bg-white dark:text-slate-900"
                >
                  <Plus size={16} className="transition-transform group-hover:rotate-90" />
                  <span>Post Job</span>
                </Link>
              )}

              <Link 
                href="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <User size={20} />
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-blue dark:text-slate-300"
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