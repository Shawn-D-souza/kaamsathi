"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, Loader2, Lock, Camera } from "lucide-react";
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
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
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

  const toggleRole = async () => {
    if (!profile) return;
    setUpdating(true);

    const newRole = profile.role === "seeker" ? "provider" : "seeker";
    
    // Optimistic update
    setProfile({ ...profile, role: newRole });

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating role:", error);
      // Revert on error
      setProfile({ ...profile, role: profile.role });
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
    <div className="flex min-h-dvh flex-col bg-gray-50 p-6 pb-24 dark:bg-black">
      <h1 className="mb-6 text-3xl font-bold text-brand-blue">Profile</h1>

      {/* Profile Card */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          {/* Avatar - Clickable to Edit */}
          <Link 
            href="/profile/edit"
            className="relative group flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue overflow-hidden dark:bg-brand-blue/20"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <User size={32} />
            )}
            
            {/* Overlay on Hover/Tap */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={20} className="text-white drop-shadow-md" />
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {profile?.full_name || "User"}
                </h2>
                <Link href="/profile/edit" className="text-xs text-brand-blue font-medium hover:underline">
                    Edit
                </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile?.role === "seeker" ? "Looking for help" : "Offering services"}
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-zinc-900">
        <div className="border-b border-gray-100 p-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Current Mode</h3>
        </div>
        <div className="flex items-center justify-between p-4">
          <span className={`text-sm font-medium ${profile?.role === "seeker" ? "text-brand-blue" : "text-gray-500"}`}>
            Seeker
          </span>
          
          <button
            onClick={toggleRole}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
              profile?.role === "provider" ? "bg-brand-orange" : "bg-brand-blue"
            }`}
          >
            <span className="sr-only">Toggle Role</span>
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                profile?.role === "provider" ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>

          <span className={`text-sm font-medium ${profile?.role === "provider" ? "text-brand-orange" : "text-gray-500"}`}>
            Provider
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href="/profile/update-password"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          <Lock size={20} />
          Change Password
        </Link>
        
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-4 font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}