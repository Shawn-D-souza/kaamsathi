import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, IndianRupee, Tag, User, MapPin, Laptop, CheckCircle2 } from "lucide-react";
import PlaceBidForm from "./place-bid";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Job
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      profiles:owner_id (full_name, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (!job) notFound();

  // 2. Check User Role
  const { data: { user } } = await supabase.auth.getUser();
  
  let isOwner = false;
  let isProvider = false;
  let hasBid = false;

  if (user) {
    isOwner = user.id === job.owner_id;
    
    if (!isOwner) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      isProvider = profile?.role === "provider";

      if (isProvider) {
        const { data: bid } = await supabase
          .from("bids")
          .select("id")
          .eq("job_id", id)
          .eq("bidder_id", user.id)
          .single();
        hasBid = !!bid;
      }
    }
  }

  // Format Date
  const formattedDate = new Date(job.deadline).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <main className="min-h-dvh bg-gray-50/50 pb-24 dark:bg-black pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      {/* Updated Width to max-w-screen-2xl to remove side gaps */}
      <div className="mx-auto max-w-screen-2xl px-4 py-4 md:pt-24 md:px-6">
        
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href={isOwner ? "/my-jobs" : "/"}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-brand-blue dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        <div className="space-y-6">
          
          {/* --- CARD 1: JOB INFO (Unified) --- */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            
            {/* Header: Title & Badges */}
            <div className="mb-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-blue dark:bg-blue-900/20 dark:text-blue-300">
                  <Tag size={12} />
                  {job.category}
                </span>
                
                {job.is_remote ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Laptop size={12} />
                    Remote
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin size={12} />
                    On-Site
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                {job.title}
              </h1>
            </div>

            {/* Meta Bar: Budget | Deadline | Owner */}
            <div className="mb-8 flex flex-col gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100 dark:bg-zinc-800/50 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              
              <div className="flex gap-6">
                {/* Budget */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-600 shadow-sm dark:bg-zinc-800 dark:text-green-400">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{job.budget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange shadow-sm dark:bg-zinc-800 dark:text-orange-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Deadline</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formattedDate}</p>
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4 sm:border-0 sm:pt-0 dark:border-zinc-700">
                 <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
                    {job.profiles?.avatar_url ? (
                      <img src={job.profiles.avatar_url ?? undefined} alt={job.profiles.full_name ?? 'User'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <User size={18} />
                      </div>
                    )}
                 </div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Posted By</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{job.profiles?.full_name}</p>
                 </div>
              </div>

            </div>

            {/* Description */}
            <div className="prose prose-blue max-w-none text-gray-600 dark:text-gray-300">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Job Description
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* --- CARD 2: ACTION (Apply / Manage) --- */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {isOwner ? "Manage Application" : hasBid ? "Application Status" : "Apply for this Job"}
            </h3>
            
            {isOwner ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                  Review bids, accept candidates, or edit your job details.
                </p>
                <Link
                  href={`/jobs/${id}/bids`}
                  className="flex w-full items-center justify-center rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
                >
                  View Applications
                </Link>
              </div>
            ) : isProvider ? (
              hasBid ? (
                <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 dark:text-green-400">Bid Placed</h4>
                    <p className="text-xs text-green-700/80 dark:text-green-300/80">
                      You've applied. Wait for the owner to accept.
                    </p>
                  </div>
                </div>
              ) : (
                <PlaceBidForm jobId={id} />
              )
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-zinc-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch to <strong>Provider</strong> mode to apply.
                </p>
                <Link 
                  href="/profile"
                  className="whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                >
                  Go to Profile
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}