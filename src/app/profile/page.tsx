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
  Settings,
  Shield,
  FileText
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

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData as Profile);

      const [reviewsRes, jobsRes] = await Promise.all([
        supabase.from("reviews").select("rating").eq("reviewee_id", user.id),
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
    window.dispatchEvent(new CustomEvent("role-updated", { detail: newRole }));

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      setProfile({ ...profile, role: profile.role }); 
      window.dispatchEvent(new CustomEvent("role-updated", { detail: profile.role }));
      alert("Failed to update role.");
    } else {
        router.refresh();
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-24 pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      <div className="mx-auto max-w-screen-xl px-6 py-4 md:pt-24">
        
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          My Profile
        </h1>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          
          <div className="lg:col-span-1 space-y-6">
            
            <div className="card-surface flex flex-col items-center rounded-3xl p-8">
              <Link 
                href="/profile/edit"
                className="group relative mb-4 h-28 w-28"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue to-brand-orange animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-[3px] overflow-hidden rounded-full border-4 border-[var(--card-bg)] shadow-md">
                    {profile?.avatar_url ? (
                    <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="h-full w-full object-cover" 
                    />
                    ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-zinc-800">
                        <User size={48} />
                    </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg border-2 border-[var(--card-bg)]">
                  <Camera size={14} />
                </div>
              </Link>
              
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {profile?.full_name || "User"}
              </h2>
              <p className="text-sm text-[var(--muted)] capitalize">
                {profile?.role === 'seeker' ? 'Hirer Account' : 'Worker Account'}
              </p>
              
              <Link href="/profile/edit" className="mt-4 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                Edit Profile
              </Link>

              <div className="mt-8 grid w-full grid-cols-2 gap-4 border-t border-[var(--card-border)] pt-6">
                  <div className="text-center">
                      <span className="block text-2xl font-bold text-[var(--foreground)]">{stats.jobsCompleted}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Jobs Done</span>
                  </div>
                  <div className="text-center border-l border-[var(--card-border)]">
                      <div className="flex items-center justify-center gap-1">
                        <span className="block text-2xl font-bold text-[var(--foreground)]">{stats.reviewCount > 0 ? stats.rating : "-"}</span>
                        {stats.reviewCount > 0 && <Star size={16} className="fill-yellow-400 text-yellow-400" />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Rating</span>
                  </div>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-4">
              <h3 className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Switch Mode
              </h3>
              <div className="relative flex rounded-xl bg-gray-100 p-1 dark:bg-zinc-950/50">
                <button
                  onClick={() => toggleRole("seeker")}
                  disabled={updating}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                    profile?.role === "seeker"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  <Search size={16} />
                  Hire Mode
                </button>
                <button
                  onClick={() => toggleRole("provider")}
                  disabled={updating}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                    profile?.role === "provider"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  <Briefcase size={16} />
                  Work Mode
                </button>
              </div>
            </div>

          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <div className="card-surface overflow-hidden rounded-2xl">
              <div className="px-6 py-4 border-b border-[var(--card-border)] bg-gray-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Settings size={16} className="text-[var(--primary)]" /> Account Settings
                </h3>
              </div>
              
              <div className="divide-y divide-[var(--card-border)]">
                {profile?.role === "provider" && (
                  <Link
                    href="/profile/locations"
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">My Work Area</p>
                        <p className="text-xs text-[var(--muted)]">Set where you can work</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[var(--muted)]" />
                  </Link>
                )}

                <Link
                  href="/profile/update-password"
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      <Lock size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--foreground)]">Password</p>
                        <p className="text-xs text-[var(--muted)]">Update your security</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--muted)]" />
                </Link>
              </div>
            </div>

            {mounted && (
              <div className="card-surface rounded-2xl p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Appearance
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setTheme(mode)}
                        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 py-4 transition-all active:scale-95 ${
                        theme === mode
                            ? "border-[var(--primary)] bg-blue-50/50 text-[var(--primary)] dark:bg-blue-500/10"
                            : "border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        }`}
                    >
                        {mode === 'light' && <Sun size={24} />}
                        {mode === 'dark' && <Moon size={24} />}
                        {mode === 'system' && <Monitor size={24} />}
                        <span className="text-xs font-bold capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="divide-y divide-[var(--card-border)]">
                  <Link
                    href="/legal/terms"
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-[var(--muted)]" />
                      <span className="text-sm font-medium text-[var(--foreground)]">Terms of Service</span>
                    </div>
                    <ChevronRight size={18} className="text-[var(--muted)]" />
                  </Link>
                  <Link
                    href="/legal/privacy"
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-[var(--muted)]" />
                      <span className="text-sm font-medium text-[var(--foreground)]">Privacy Policy</span>
                    </div>
                    <ChevronRight size={18} className="text-[var(--muted)]" />
                  </Link>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-[0.99] dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>

            <div className="text-center pb-8">
                <p className="text-[10px] text-[var(--muted)]">KaamSaathi v1.0.0</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}