import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, IndianRupee, Search, Briefcase, FileText } from "lucide-react";

export default async function MyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isSeeker = profile?.role === "seeker";

  let items = [];

  if (isSeeker) {
    // Fetch Jobs Posted by User
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    items = data || [];
  } else {
    // Fetch Bids Placed by Provider (joined with Job details)
    const { data } = await supabase
      .from("bids")
      .select(`
        *,
        jobs (title, status, deadline)
      `)
      .eq("bidder_id", user.id)
      .order("created_at", { ascending: false });
    items = data || [];
  }

  return (
    <main className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      <h1 className="mb-6 text-2xl font-bold text-brand-blue">
        {isSeeker ? "My Postings" : "My Bids"}
      </h1>

      {items.length === 0 ? (
        <div className="mt-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
            {isSeeker ? <Briefcase className="text-gray-400" /> : <FileText className="text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isSeeker ? "No jobs posted" : "No bids placed"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isSeeker ? "Post a job to get started." : "Browse the feed to find work."}
          </p>
          {isSeeker ? (
            <Link href="/jobs/new" className="mt-4 inline-block rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white">
              Post a Job
            </Link>
          ) : (
            <Link href="/" className="mt-4 inline-block rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white">
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item: any) => (
            <Link 
              key={item.id} 
              href={isSeeker ? `/jobs/${item.id}/bids` : `/jobs/${item.job_id || item.jobs?.id}`} // Seekers go to Bid Management, Providers go to Job Details
              className="block rounded-xl bg-white p-5 shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {isSeeker ? item.title : item.jobs?.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isSeeker ? (
                      item.status === 'open' ? 'Accepting Bids' : 'In Progress'
                    ) : (
                      `Bid Status: ${item.status}`
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                  <IndianRupee size={14} />
                  {isSeeker ? item.budget : item.amount}
                </div>
              </div>
              
              {!isSeeker && (
                 <div className="mt-3 text-xs text-gray-400 flex gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded dark:bg-zinc-800">
                        Job Status: {item.jobs?.status}
                    </span>
                 </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}