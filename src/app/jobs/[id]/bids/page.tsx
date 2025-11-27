import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, IndianRupee, User, MessageSquare, CheckCircle2 } from "lucide-react";
import AcceptButton from "./accept-button";

export default async function ViewBidsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // 1. Fetch Job & Hired Count
  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, owner_id, status, quantity")
    .eq("id", id)
    .single();

  if (!job) notFound();
  if (job.owner_id !== user.id) redirect("/");

  // 2. Fetch Bids
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      id, amount, created_at, status, bidder_id,
      profiles:bidder_id (full_name, avatar_url)
    `)
    .eq("job_id", id)
    .order("amount", { ascending: true });

  // Calculate Stats
  const hiredCount = bids?.filter((b: any) => b.status === 'accepted').length || 0;
  const isFull = hiredCount >= job.quantity;

  return (
    <main className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link
                href="/my-jobs"
                className="rounded-full bg-white p-2 shadow-sm hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                <h1 className="text-xl font-bold text-brand-blue">Manage Bids</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{job.title}</p>
                </div>
            </div>
            
            {/* Chat Shortcut (Visible if at least 1 hired) */}
            {hiredCount > 0 && (
                <Link
                    href={`/messages/${job.id}`}
                    className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-brand-blue hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                >
                    <MessageSquare size={14} />
                    Chat
                </Link>
            )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Hiring Progress</span>
                <span className={`font-bold ${isFull ? 'text-green-600' : 'text-brand-blue'}`}>
                    {hiredCount} / {job.quantity} Filled
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isFull ? 'bg-green-500' : 'bg-brand-blue'}`}
                    style={{ width: `${(hiredCount / job.quantity) * 100}%` }}
                />
            </div>
            {isFull && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Job is full. Other bids have been rejected.
                </p>
            )}
        </div>
      </div>

      {/* Bids List */}
      {!bids || bids.length === 0 ? (
        <div className="mt-20 text-center text-gray-500 dark:text-gray-400">
          <p>No bids received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid: any) => {
             const bidderProfile = Array.isArray(bid.profiles) ? bid.profiles[0] : bid.profiles;
             const isAccepted = bid.status === 'accepted';
             const isRejected = bid.status === 'rejected';

             return (
                <div key={bid.id} className={`rounded-xl p-5 shadow-sm border transition-all ${
                    isAccepted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' 
                    : isRejected
                    ? 'bg-gray-50 border-gray-100 opacity-60 dark:bg-zinc-900 dark:border-zinc-800'
                    : 'bg-white border-transparent dark:bg-zinc-900 dark:border-zinc-800'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden dark:bg-zinc-800">
                        {bidderProfile?.avatar_url ? (
                            <img src={bidderProfile.avatar_url} alt="Bidder" className="h-full w-full object-cover" />
                        ) : (
                            <User size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                          <p className="font-medium text-gray-900 dark:text-white">{bidderProfile?.full_name}</p>
                          <p className="text-xs text-gray-500">{new Date(bid.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-brand-blue flex items-center">
                        <IndianRupee size={16} />
                        {bid.amount}
                    </div>
                  </div>
                  
                  {/* Action Area */}
                  {isAccepted ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-green-200/50 py-2 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle2 size={16} />
                        Hired
                    </div>
                  ) : isRejected ? (
                    <div className="text-center text-sm font-medium text-gray-400">
                        Rejected
                    </div>
                  ) : !isFull ? (
                    <AcceptButton 
                      jobId={job.id} 
                      bidId={bid.id} 
                      providerId={bid.bidder_id} 
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-400">
                        Positions Full
                    </div>
                  )}
                </div>
             );
          })}
        </div>
      )}
    </main>
  );
}