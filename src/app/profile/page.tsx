"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, User, Loader2, Lock, Camera, MapPin, ChevronRight, Briefcase, Search, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  full_name: string;
  role: "seeker" | "provider";
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    getProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const toggleRole = async (newRole: "seeker" | "provider") => {
    if (!profile || profile.role === newRole) return;
    setUpdating(true);

    // Optimistic update
    setProfile({ ...profile, role: newRole });

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating role:", error);
      setProfile({ ...profile, role: profile.role }); // Revert
      alert("Failed to update role.");
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      <h1 className="mb-8 text-3xl font-bold text-brand-blue">Profile</h1>

      {/* User Info Card */}
      <div className="mb-8 flex flex-col items-center">
        <Link 
          href="/profile/edit"
          className="group relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm transition-transform active:scale-95 dark:border-zinc-800"
        >
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 dark:bg-zinc-800">
              <User size={40} />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={24} className="text-white" />
          </div>
        </Link>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {profile?.full_name || "User"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile?.role === "seeker" ? "Looking for help" : "Offering services"}
        </p>
        <Link href="/profile/edit" className="mt-2 text-xs font-semibold text-brand-blue hover:underline">
          Edit Profile
        </Link>
      </div>

      {/* Role Switcher */}
      <div className="mb-6">
        <h3 className="mb-3 ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Mode
        </h3>
        <div className="relative flex rounded-xl bg-gray-200 p-1 dark:bg-zinc-800">
          <button
            onClick={() => toggleRole("seeker")}
            disabled={updating}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              profile?.role === "seeker"
                ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Search size={16} />
            Seeker
          </button>
          <button
            onClick={() => toggleRole("provider")}
            disabled={updating}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              profile?.role === "provider"
                ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Briefcase size={16} />
            Provider
          </button>
        </div>
      </div>

      {/* Appearance / Theme Switcher */}
      {mounted && (
        <div className="mb-8">
          <h3 className="mb-3 ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                theme === "light"
                  ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "border-transparent bg-white text-gray-500 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Sun size={20} />
              <span className="text-xs font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                theme === "dark"
                  ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "border-transparent bg-white text-gray-500 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Moon size={20} />
              <span className="text-xs font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                theme === "system"
                  ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "border-transparent bg-white text-gray-500 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Monitor size={20} />
              <span className="text-xs font-medium">System</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Actions */}
      <div className="space-y-4">
        {profile?.role === "provider" && (
          <Link
            href="/profile/locations"
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm active:scale-[0.99] transition-transform dark:bg-zinc-900"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-brand-orange dark:bg-orange-900/20">
                <MapPin size={20} />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Service Zones
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 dark:text-zinc-600" />
          </Link>
        )}

        <Link
          href="/profile/update-password"
          className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm active:scale-[0.99] transition-transform dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-brand-blue dark:bg-blue-900/20">
              <Lock size={20} />
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Change Password
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300 dark:text-zinc-600" />
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm active:scale-[0.99] transition-transform dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-900/20">
              <LogOut size={20} />
            </div>
            <div className="text-sm font-medium text-red-600 dark:text-red-400">
              Sign Out
            </div>
          </div>
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-300 dark:text-zinc-700">KaamSaathi v1.0.0</p>
      </div>
    </div>
  );
}