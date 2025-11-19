"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type AuthView = "sign-in" | "sign-up" | "forgot-password";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [view, setView] = useState<AuthView>("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();

      } else if (view === "sign-up") {
        // Validation
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: {
              full_name: email.split("@")[0],
              avatar_url: "",
            },
          },
        });
        if (error) throw error;
        setMessage("Success! Check your email for the confirmation link.");
        
      } else if (view === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback?next=/profile/update-password`,
        });
        if (error) throw error;
        setMessage("If an account exists, we've sent a password reset link.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-blue">KaamSathi</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {view === "sign-in" && "Welcome back!"}
            {view === "sign-up" && "Create your account"}
            {view === "forgot-password" && "Reset your password"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {view !== "forgot-password" && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {view === "sign-up" && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          {view === "sign-in" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                    setView("forgot-password");
                    setError(null);
                    setMessage(null);
                }}
                className="text-xs font-medium text-brand-blue hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              view === "sign-in" ? "Sign In" : 
              view === "sign-up" ? "Sign Up" : 
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          {view === "forgot-password" ? (
             <button
             onClick={() => {
               setView("sign-in");
               setError(null);
               setMessage(null);
             }}
             className="font-semibold text-brand-blue hover:underline"
           >
             Back to Sign In
           </button>
          ) : (
            <>
                <span className="text-gray-600 dark:text-gray-400">
                    {view === "sign-in"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <button
                    onClick={() => {
                    setView(view === "sign-in" ? "sign-up" : "sign-in");
                    setError(null);
                    setMessage(null);
                    }}
                    className="font-semibold text-brand-blue hover:underline"
                >
                    {view === "sign-in" ? "Sign up" : "Sign in"}
                </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}