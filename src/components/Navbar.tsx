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
    // Solid Blue Header - Frames the app perfectly
    <header className="fixed top-0 left-0 z-50 hidden w-full border-b border-white/10 bg-brand-blue shadow-lg shadow-blue-900/5 dark:bg-[#0f172a] dark:border-slate-800 md:block">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">
            KaamSaathi
          </Link>
          
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white opacity-100"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "fill-white/20" : ""} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSeeker && (
            <Link
              href="/jobs/new"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-brand-blue shadow-sm transition-transform hover:bg-blue-50 active:scale-95"
            >
              <Plus size={18} />
              <span>Post Job</span>
            </Link>
          )}

          <Link 
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}