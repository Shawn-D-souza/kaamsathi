import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, IndianRupee, User, MessageSquare, CheckCircle2, Star, Briefcase, Clock, XCircle } from "lucide-react";
import AcceptButton from "./accept-button";

export default async function ViewBidsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // 1. Fetch Job Info
  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, owner_id, status, quantity")
    .eq("id", id)
    .single();

  if (!job) notFound();
  if (job.owner_id !== user.id) redirect("/");

  // 2. Fetch Bids with Profiles & Ratings
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      id, amount, created_at, status, bidder_id, proposal_text,
      profiles:bidder_id (
        full_name, 
        avatar_url,
        reviews:reviews!reviewee_id (rating) 
      )
    `)
    .eq("job_id", id)
    .order("amount", { ascending: true });

  // Helper to calculate average rating
  const getRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const hiredCount = bids?.filter((b: any) => b.status === 'accepted').length || 0;
  const isFull = hiredCount >= job.quantity;

  return (
    <main className="min-h-dvh bg-gray-50/50 dark:bg-black">
      {/* Full Width Container */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/my-jobs"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-blue">Manage Bids</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{job.title}</p>
              </div>
            </div>
            
            {/* Chat Shortcut */}
            {hiredCount > 0 && (
                <Link
                    href={`/messages/${job.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-brand-blue transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                >
                    <MessageSquare size={18} />
                    Job Chat
                </Link>
            )}
          </div>

          {/* Progress Bar Card */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hiring Progress</span>
                <span className={`text-sm font-bold ${isFull ? 'text-green-600' : 'text-brand-blue'}`}>
                    {hiredCount} / {job.quantity} Filled
                </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${isFull ? 'bg-green-500' : 'bg-brand-blue'}`}
                    style={{ width: `${Math.min((hiredCount / job.quantity) * 100, 100)}%` }}
                />
            </div>
            {isFull && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 size={14} />
                    Job is full. Remaining bids are automatically closed.
                </p>
            )}
          </div>
        </div>

        {/* Bids List */}
        {!bids || bids.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900">
                <Briefcase className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bids yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Wait for providers to apply.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid: any) => {
              const bidderProfile = Array.isArray(bid.profiles) ? bid.profiles[0] : bid.profiles;
              const isAccepted = bid.status === 'accepted';
              const isRejected = bid.status === 'rejected';
              
              const avgRating = getRating(bidderProfile?.reviews);
              const reviewCount = bidderProfile?.reviews?.length || 0;

              return (
                  <div key={bid.id} className={`group relative w-full overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:shadow-md ${
                      isAccepted 
                      ? 'border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10' 
                      : isRejected
                      ? 'border-gray-100 bg-gray-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-900'
                      : 'border-gray-100 bg-white hover:border-gray-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                  }`}>
                    
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        
                        {/* Left: User Info & Proposal */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                                    {bidderProfile?.avatar_url ? (
                                        <img src={bidderProfile.avatar_url} alt="Bidder" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                            <User size={20} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{bidderProfile?.full_name}</h3>
                                        {avgRating && (
                                            <span className="flex items-center gap-0.5 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                                                <Star size={10} className="fill-current" />
                                                {avgRating} <span className="font-normal opacity-70">({reviewCount})</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock size={12} />
                                        Applied {new Date(bid.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Removed quotes around bid.proposal_text */}
                            {bid.proposal_text && (
                                <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-zinc-800/50 dark:text-gray-300">
                                    {bid.proposal_text}
                                </div>
                            )}
                        </div>

                        {/* Right: Actions & Amount */}
                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 lg:w-64 lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-zinc-800">
                            
                            <div className="flex items-center justify-between w-full lg:flex-col lg:items-end">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bid Amount</span>
                                <div className="flex items-center gap-0.5 text-xl font-bold text-brand-blue">
                                    <IndianRupee size={18} className="mt-[2px]" />
                                    {bid.amount}
                                </div>
                            </div>

                            <div className="w-full">
                                {isAccepted ? (
                                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-100 py-2.5 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircle2 size={16} />
                                        Hired
                                    </div>
                                ) : isRejected ? (
                                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-400 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <XCircle size={16} />
                                        Rejected
                                    </div>
                                ) : !isFull ? (
                                    <AcceptButton 
                                        jobId={job.id} 
                                        bidId={bid.id} 
                                        providerId={bid.bidder_id} 
                                    />
                                ) : (
                                    <div className="text-center text-xs font-medium text-gray-400 py-2">
                                        Positions Full
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                  </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}