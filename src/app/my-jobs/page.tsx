import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IndianRupee, Briefcase, FileText, ChevronRight, Layers } from "lucide-react";

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
        jobs (id, title, status, budget)
      `)
      .eq("bidder_id", user.id)
      .order("created_at", { ascending: false })
  ]);

  const postedJobs = postedJobsRes.data || [];
  const myBids = myBidsRes.data || [];
  const isEmpty = postedJobs.length === 0 && myBids.length === 0;

  return (
    <main className="min-h-dvh bg-gray-50 p-4 pb-24 md:p-8 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue dark:bg-blue-900/20 dark:text-blue-400">
            <Layers size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Activity</h1>
        </header>

        {isEmpty ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No activity yet</h3>
            <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Post a job to find help, or browse the feed to find work.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/jobs/new" className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                Post Job
              </Link>
              <Link href="/" className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Find Work
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* SECTION 1: JOBS I POSTED */}
            {postedJobs.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Briefcase size={14} />
                  Jobs You Posted
                </h2>
                <div className="space-y-3">
                  {postedJobs.map((job: any) => (
                    <Link 
                      key={job.id} 
                      href={`/jobs/${job.id}/bids`}
                      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate dark:text-white group-hover:text-brand-blue transition-colors">
                            {job.title}
                          </h3>
                          <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${
                              job.status === 'open' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : job.status === 'completed'
                                ? 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {job.status === 'open' ? 'Open' : job.status === 'in_progress' ? 'In Progress' : 'Completed'}
                            </span>
                            <span>•</span>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 pl-4">
                          <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                            <IndianRupee size={14} className="mt-[1px]" />
                            {job.budget}
                          </div>
                          <ChevronRight size={16} className="text-gray-300 dark:text-zinc-700 group-hover:text-brand-blue transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: BIDS I PLACED */}
            {myBids.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <FileText size={14} />
                  Your Bids
                </h2>
                <div className="space-y-3">
                  {myBids.map((bid: any) => (
                    <Link 
                      key={bid.id} 
                      href={bid.jobs?.id ? `/jobs/${bid.jobs.id}` : '#'}
                      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate dark:text-white group-hover:text-brand-blue transition-colors">
                            {bid.jobs?.title || "Unknown Job"}
                          </h3>
                          <div className="mt-1.5 flex items-center gap-2 text-xs">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${
                              bid.status === 'accepted' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : bid.status === 'rejected'
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                            }`}>
                              {bid.status === 'pending' ? 'Pending' : bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </span>
                            <span className="text-gray-400 dark:text-zinc-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Bid: ₹{bid.amount}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm font-medium text-gray-400 dark:text-zinc-500">
                           {bid.jobs?.budget && <span className="text-xs mr-2">Budget: ₹{bid.jobs.budget}</span>}
                           <ChevronRight size={16} />
                        </div>
                      </div>
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