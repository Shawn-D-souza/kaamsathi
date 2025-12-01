"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

type AuthView = "sign-in" | "sign-up" | "forgot-password";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Legal Consent State
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        if (!agreedToTerms) {
          throw new Error("You must agree to the Terms and Privacy Policy to continue.");
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
    // FIX: Switched to 'min-h-dvh' and added 'overflow-hidden' to prevent mobile scroll glitch
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-gray-50/50 p-4 dark:bg-black selection:bg-brand-blue/20">
        
        {/* Decorative background blob */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>

      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-zinc-900 dark:ring-zinc-800 md:p-10">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-brand-blue tracking-tight">KaamSaathi</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {view === "sign-in" && "Welcome back! Please sign in."}
            {view === "sign-up" && "Create your account to get started."}
            {view === "forgot-password" && "Reset your password."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {message && (
            <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                </div>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-brand-blue transition-all"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {view !== "forgot-password" && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                    </div>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-brand-blue transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>
            )}

            {view === "sign-up" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                    </div>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-brand-blue transition-all"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* --- Legal Consent Checkbox --- */}
                <div className="flex items-start gap-3 px-1 pt-1">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <Link 
                        href="/legal/terms" 
                        target="_blank" 
                        className="font-semibold text-brand-blue hover:underline"
                      >
                        Terms of Service
                      </Link>
                      {" "}and{" "}
                      <Link 
                        href="/legal/privacy" 
                        target="_blank" 
                        className="font-semibold text-brand-blue hover:underline"
                      >
                        Privacy Policy
                      </Link>.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {view === "sign-in" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                    setView("forgot-password");
                    setError(null);
                    setMessage(null);
                }}
                className="text-xs font-semibold text-brand-blue hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-brand-orange px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              view === "sign-in" ? "Sign In" : 
              view === "sign-up" ? "Create Account" : 
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
             className="font-bold text-gray-600 hover:text-brand-blue transition-colors dark:text-gray-400"
           >
             ← Back to Sign In
           </button>
          ) : (
            <div className="flex flex-col gap-2">
                <span className="text-gray-500 dark:text-gray-400">
                    {view === "sign-in"
                    ? "New to KaamSaathi?"
                    : "Already have an account?"}
                </span>
                <button
                    onClick={() => {
                    setView(view === "sign-in" ? "sign-up" : "sign-in");
                    setError(null);
                    setMessage(null);
                    }}
                    className="font-bold text-brand-blue hover:text-blue-700 transition-colors"
                >
                    {view === "sign-in" ? "Create an account" : "Sign in to your account"}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}