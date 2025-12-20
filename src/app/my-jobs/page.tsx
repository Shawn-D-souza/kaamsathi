import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IndianRupee, Briefcase, FileText, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default async function MyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const [postedJobsRes, myBidsRes] = await Promise.all([
    supabase.from("jobs").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
    supabase.from("bids").select(`*, jobs (id, title, status, budget, deadline)`).eq("bidder_id", user.id).order("created_at", { ascending: false })
  ]);

  const postedJobs = postedJobsRes.data || [];
  const myBids = myBidsRes.data || [];
  const isEmpty = postedJobs.length === 0 && myBids.length === 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <span className="badge-success">Open</span>;
      case 'in_progress': return <span className="badge-info">Active</span>;
      case 'completed': return <span className="badge-neutral">Done</span>;
      default: return null;
    }
  };

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <span className="badge-success"><CheckCircle2 size={12} /> Accepted</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-500/20 dark:text-red-400"><XCircle size={12} /> Rejected</span>;
      default: return <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-yellow-600 border border-yellow-500/20 dark:text-yellow-500"><AlertCircle size={12} /> Pending</span>;
    }
  };

  return (
    <main className="min-h-dvh pb-24 pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      <div className="mx-auto max-w-screen-2xl px-6 py-4 md:pt-24">
        
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">My Activity</h1>
        </header>

        {isEmpty ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--card-border)] p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm"><Briefcase className="h-8 w-8 text-gray-400" /></div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">No activity yet</h3>
            <div className="mt-6 flex gap-3"><Link href="/jobs/new" className="btn-primary">Post Job</Link><Link href="/" className="btn-secondary">Find Work</Link></div>
          </div>
        ) : (
          <div className="space-y-10">
            {postedJobs.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--muted)]"><Briefcase size={16} /> Jobs You Posted</h2>
                <div className="space-y-3">
                  {postedJobs.map((job: any) => (
                    <Link key={job.id} href={`/jobs/${job.id}/bids`} className="card-surface group relative block w-full overflow-hidden rounded-2xl p-5 hover:border-brand-blue/30">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-brand-blue">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3">{getStatusBadge(job.status)}<span className="flex items-center gap-1 text-sm text-[var(--muted)]"><Clock size={14} /> {new Date(job.created_at).toLocaleDateString()}</span></div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3 sm:w-auto sm:border-0 sm:pt-0">
                          <div className="flex items-center gap-1 text-lg font-bold text-[var(--foreground)] sm:mr-6"><IndianRupee size={16} className="mt-[2px] text-[var(--muted)]" />{job.budget}</div>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-blue" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {myBids.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--muted)]"><FileText size={16} /> Your Bids</h2>
                <div className="space-y-3">
                  {myBids.map((bid: any) => (
                    <Link key={bid.id} href={bid.jobs?.id ? `/jobs/${bid.jobs.id}` : '#'} className="card-surface group relative block w-full overflow-hidden rounded-2xl p-5 hover:border-brand-blue/30">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-brand-blue">{bid.jobs?.title || "Unknown Job"}</h3>
                          <div className="flex flex-wrap items-center gap-3">{getBidStatusBadge(bid.status)}<span className="text-xs text-[var(--muted)]">Placed on {new Date(bid.created_at).toLocaleDateString()}</span></div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3 sm:w-auto sm:border-0 sm:pt-0">
                           <div className="sm:text-right sm:mr-6"><span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block mb-0.5">Your Bid</span><div className="flex items-center gap-0.5 text-lg font-bold text-brand-blue"><IndianRupee size={16} className="mt-[2px]" />{bid.amount}</div></div>
                           <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-blue" />
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