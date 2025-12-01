"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LogOut, 
  User, 
  Loader2, 
  Lock, 
  Camera, 
  MapPin, 
  ChevronRight, 
  Briefcase, 
  Search, 
  Moon, 
  Sun, 
  Monitor, 
  Star, 
  CheckCircle,
  Shield,
  FileText,
  Settings
} from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  full_name: string;
  role: "seeker" | "provider";
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ rating: "0.0", reviewCount: 0, jobsCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData as Profile);

      // 2. Fetch Stats (Parallel)
      const [reviewsRes, jobsRes] = await Promise.all([
        // Get average rating (as Provider)
        supabase.from("reviews").select("rating").eq("reviewee_id", user.id),
        // Get completed jobs (as Seeker)
        supabase.from("jobs").select("id", { count: 'exact' }).eq("owner_id", user.id).eq("status", "completed")
      ]);

      const ratings = reviewsRes.data || [];
      const avg = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1) 
        : "N/A";

      setStats({
        rating: avg,
        reviewCount: ratings.length,
        jobsCompleted: jobsRes.count || 0
      });

      setLoading(false);
    };

    getData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const toggleRole = async (newRole: "seeker" | "provider") => {
    if (!profile || profile.role === newRole) return;
    setUpdating(true);
    setProfile({ ...profile, role: newRole });

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      setProfile({ ...profile, role: profile.role }); 
      alert("Failed to update role.");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50/50 pb-24 dark:bg-black">
      <div className="mx-auto max-w-screen-xl px-6 py-8">
        
        <h1 className="mb-8 text-2xl font-bold text-brand-blue">Profile</h1>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          
          {/* --- LEFT COLUMN: Identity & Stats --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Link 
                href="/profile/edit"
                className="group relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-gray-50 shadow-sm transition-transform active:scale-95 dark:border-zinc-800"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-zinc-800">
                    <User size={40} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity sm:group-hover:opacity-100">
                  <Camera size={24} className="text-white" />
                </div>
              </Link>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile?.full_name || "User"}
              </h2>
              
              <Link href="/profile/edit" className="mt-2 text-xs font-semibold text-brand-blue hover:underline">
                Edit Profile
              </Link>

              {/* Stats Row */}
              <div className="mt-6 flex w-full justify-center gap-4 border-t border-gray-100 pt-6 dark:border-zinc-800">
                  <div className="text-center">
                      <span className="block text-lg font-bold text-gray-900 dark:text-white">{stats.jobsCompleted}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Jobs Given</span>
                  </div>
                  <div className="h-auto w-px bg-gray-200 dark:bg-zinc-700"></div>
                  <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="block text-lg font-bold text-gray-900 dark:text-white">{stats.reviewCount > 0 ? stats.rating : "-"}</span>
                        {stats.reviewCount > 0 && <Star size={12} className="fill-brand-orange text-brand-orange" />}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Rating</span>
                  </div>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Mode
              </h3>
              <div className="relative flex rounded-xl bg-gray-100 p-1 dark:bg-zinc-800">
                <button
                  onClick={() => toggleRole("seeker")}
                  disabled={updating}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
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
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    profile?.role === "provider"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
                >
                  <Briefcase size={16} />
                  Provider
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-gray-400">
                {profile?.role === "seeker" 
                  ? "You are hiring people for jobs." 
                  : "You are looking for work."}
              </p>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Settings & Menus --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Settings Group */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-5 py-4 border-b border-gray-50 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings size={16} className="text-gray-400" /> Account Settings
                </h3>
              </div>
              
              <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                {profile?.role === "provider" && (
                  <Link
                    href="/profile/locations"
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand-orange dark:bg-orange-900/20">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Service Zones</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 dark:text-zinc-600" />
                  </Link>
                )}

                <Link
                  href="/profile/update-password"
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-blue dark:bg-blue-900/20">
                      <Lock size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Change Password</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 dark:text-zinc-600" />
                </Link>
              </div>
            </div>

            {/* Appearance */}
            {mounted && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Appearance
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all active:scale-95 ${
                      theme === "light"
                        ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                        : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Sun size={20} />
                    <span className="text-xs font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all active:scale-95 ${
                      theme === "dark"
                        ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                        : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Moon size={20} />
                    <span className="text-xs font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all active:scale-95 ${
                      theme === "system"
                        ? "border-brand-blue bg-blue-50 text-brand-blue dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                        : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Monitor size={20} />
                    <span className="text-xs font-medium">System</span>
                  </button>
                </div>
              </div>
            )}

            {/* Legal & Danger */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                  <Link
                    href="/legal/terms"
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Terms of Service</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 dark:text-zinc-600" />
                  </Link>
                  <Link
                    href="/legal/privacy"
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Privacy Policy</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 dark:text-zinc-600" />
                  </Link>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-bold text-red-600 shadow-sm border border-gray-100 transition-all hover:bg-red-50 active:scale-[0.99] dark:bg-zinc-900 dark:border-zinc-800 dark:text-red-400 dark:hover:bg-red-900/10"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>

            <div className="text-center">
                <p className="text-[10px] text-gray-400 dark:text-zinc-600">KaamSaathi v1.0.0</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}