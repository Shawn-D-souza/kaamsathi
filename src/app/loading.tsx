import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col space-y-4 p-4 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Main Content Skeletons (Simulating Cards) */}
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="w-full rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Top Row: Icon + Title */}
          <div className="mb-3 flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>

          {/* Middle Row: Tag placeholders */}
          <div className="mb-4 flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-6 w-16 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>

          {/* Bottom Row: Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}

      {/* Centered Spinner for reassurance */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-5">
        <Loader2 className="h-24 w-24 animate-spin text-brand-blue" />
      </div>
    </div>
  );
}