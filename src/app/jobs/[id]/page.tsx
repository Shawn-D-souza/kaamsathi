import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, IndianRupee, Tag, User } from "lucide-react";
import PlaceBidForm from "./place-bid";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

      // Check if provider already bid
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

  return (
    <main className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={isOwner ? "/my-jobs" : "/"}
          className="rounded-full bg-white p-2 shadow-sm hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-xl font-bold text-brand-blue">Job Details</h1>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-zinc-900">
        {/* Job Meta */}
        <div className="p-6">
           <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-brand-blue dark:bg-blue-900/20 dark:text-blue-300">
                <Tag size={12} />
                <span className="capitalize">{job.category}</span>
              </span>
              <span className="text-xs text-gray-500">{new Date(job.created_at).toLocaleDateString()}</span>
           </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{job.title}</h2>
          
          <div className="flex items-center gap-3 mb-6">
             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden dark:bg-zinc-800">
                {job.profiles?.avatar_url ? (
                    <img src={job.profiles.avatar_url} alt="Owner" className="h-full w-full object-cover" />
                ) : (
                    <User size={20} className="text-gray-500" />
                )}
             </div>
             <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{job.profiles?.full_name}</p>
                <p className="text-xs text-gray-500">Posted by</p>
             </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-4 dark:border-zinc-800">
             <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <IndianRupee size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{job.budget}</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-50 text-brand-orange dark:bg-orange-900/20 dark:text-orange-400">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(job.deadline).toLocaleDateString()}
                    </p>
                </div>
             </div>
          </div>
        </div>

        {/* Actions - UPDATED: Continuous background (white/zinc-900) with top border */}
        <div className="p-6 border-t border-gray-100 dark:border-zinc-800">
          {isOwner ? (
            <Link
              href={`/jobs/${id}/bids`}
              className="flex w-full items-center justify-center rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View Bids
            </Link>
          ) : isProvider ? (
             hasBid ? (
                <div className="rounded-lg bg-green-100 p-4 text-center text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    ✅ You have placed a bid on this job.
                </div>
             ) : (
                <PlaceBidForm jobId={id} />
             )
          ) : (
            <div className="text-center text-sm text-gray-500">
                Switch to <strong>Provider</strong> mode in Profile to bid on this job.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}