import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IndianRupee, Briefcase, FileText, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default async function MyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch both sets of data in parallel
  const [postedJobsRes, myBidsRes] = await Promise.all([
    // 1. Jobs I Posted
    supabase
      .from("jobs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
    
    // 2. Bids I Placed
    supabase
      .from("bids")
      .select(`
        *,
        jobs (id, title, status, budget, deadline)
      `)
      .eq("bidder_id", user.id)
      .order("created_at", { ascending: false })
  ]);

  const postedJobs = postedJobsRes.data || [];
  const myBids = myBidsRes.data || [];
  const isEmpty = postedJobs.length === 0 && myBids.length === 0;

  // Helper for Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-400">Open</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Active</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">Done</span>;
      default:
        return null;
    }
  };

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
            <AlertCircle size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <main className="min-h-dvh bg-gray-50/50 dark:bg-black">
      {/* Full Width Container */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-brand-blue">My Activity</h1>
        </header>

        {isEmpty ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-zinc-800">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-900">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No activity yet</h3>
            <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Post a job to find help, or browse the feed to find work.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/jobs/new" className="rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all">
                Post Job
              </Link>
              <Link href="/" className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 active:scale-95 transition-all">
                Find Work
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* SECTION 1: JOBS I POSTED */}
            {postedJobs.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Briefcase size={16} />
                  Jobs You Posted
                </h2>
                <div className="space-y-4">
                  {postedJobs.map((job: any) => (
                    <Link 
                      key={job.id} 
                      href={`/jobs/${job.id}/bids`}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-brand-blue/30 sm:hover:shadow-lg sm:active:scale-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-gray-900 transition-colors sm:group-hover:text-brand-blue dark:text-gray-50">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            {getStatusBadge(job.status)}
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-800 sm:w-auto sm:border-0 sm:pt-0">
                          <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white sm:mr-6">
                            <IndianRupee size={16} className="mt-[2px] text-gray-400" />
                            {job.budget}
                          </div>
                          <div className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors sm:group-hover:bg-brand-blue/10 sm:group-hover:text-brand-blue dark:bg-zinc-800 dark:sm:group-hover:bg-blue-900/20 dark:sm:group-hover:text-blue-400">
                             <ChevronRight size={18} />
                          </div>
                        </div>

                      </div>
                      
                      {/* Decorative Hover Indicator (Desktop Only) */}
                      <div className="absolute inset-y-0 left-0 w-1 scale-y-0 bg-brand-blue transition-transform duration-300 ease-out sm:group-hover:scale-y-100"></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: BIDS I PLACED */}
            {myBids.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <FileText size={16} />
                  Your Bids
                </h2>
                <div className="space-y-4">
                  {myBids.map((bid: any) => (
                    <Link 
                      key={bid.id} 
                      href={bid.jobs?.id ? `/jobs/${bid.jobs.id}` : '#'}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-brand-blue/30 sm:hover:shadow-lg sm:active:scale-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-gray-900 transition-colors sm:group-hover:text-brand-blue dark:text-gray-50">
                            {bid.jobs?.title || "Unknown Job"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            {getBidStatusBadge(bid.status)}
                            <span className="text-xs text-gray-400 dark:text-zinc-500">
                                Placed on {new Date(bid.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-800 sm:w-auto sm:border-0 sm:pt-0">
                           <div className="sm:text-right sm:mr-6">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Your Bid</span>
                                <div className="flex items-center gap-0.5 text-lg font-bold text-brand-blue">
                                    <IndianRupee size={16} className="mt-[2px]" />
                                    {bid.amount}
                                </div>
                           </div>
                           <div className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors sm:group-hover:bg-brand-blue/10 sm:group-hover:text-brand-blue dark:bg-zinc-800 dark:sm:group-hover:bg-blue-900/20 dark:sm:group-hover:text-blue-400">
                             <ChevronRight size={18} />
                          </div>
                        </div>

                      </div>
                      
                      {/* Decorative Hover Indicator (Desktop Only) */}
                      <div className="absolute inset-y-0 left-0 w-1 scale-y-0 bg-brand-blue transition-transform duration-300 ease-out sm:group-hover:scale-y-100"></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  );
}