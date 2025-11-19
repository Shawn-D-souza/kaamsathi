"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Updated import
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient(); // Updated usage

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/"); 
        router.refresh();
      } else {
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
        alert("Check your email for the confirmation link!");
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
            {view === "sign-in" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
              {error}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : view === "sign-in" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {view === "sign-in"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setView(view === "sign-in" ? "sign-up" : "sign-in");
              setError(null);
            }}
            className="font-semibold text-brand-blue hover:underline"
          >
            {view === "sign-in" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}