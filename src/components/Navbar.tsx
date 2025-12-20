"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User, Plus, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

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

    // Listen for role updates
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
    // SOLID BLUE HEADER (Restored Old Design)
    <header className="fixed top-0 left-0 z-50 hidden w-full border-b border-white/10 bg-brand-blue shadow-lg shadow-blue-900/5 dark:bg-[#0f172a] dark:border-slate-800 md:block">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        {/* Left Side: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
             {/* Logo Image */}
             <div className="relative h-8 w-8 overflow-hidden rounded-lg shadow-md border border-white/20">
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
          
          {/* ONLY SHOW LINKS IF LOGGED IN */}
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
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
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
            </>
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