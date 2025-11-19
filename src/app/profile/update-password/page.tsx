"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setSuccess(true);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black pb-20">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-blue">Set New Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle size={16} />
              <span>Password updated! Redirecting...</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="flex w-full justify-center rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}