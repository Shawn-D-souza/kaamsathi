import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, IndianRupee, User, Check } from "lucide-react";

export default async function ViewBidsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Verify Ownership
  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, owner_id")
    .eq("id", id)
    .single();

  if (!job) notFound();
  if (job.owner_id !== user.id) redirect("/");

  // Fetch Bids
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      id,
      amount,
      created_at,
      status,
      profiles:bidder_id (full_name, avatar_url)
    `)
    .eq("job_id", id)
    .order("amount", { ascending: true }); // Lowest bids first

  return (
    <main className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      <div className="mb-6 flex items-center gap-4">
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

      {!bids || bids.length === 0 ? (
        <div className="mt-20 text-center text-gray-500 dark:text-gray-400">
          <p>No bids received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid: any) => (
            <div key={bid.id} className="rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-900">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden dark:bg-zinc-800">
                     {bid.profiles?.avatar_url ? (
                        <img src={bid.profiles.avatar_url} alt="Bidder" className="h-full w-full object-cover" />
                     ) : (
                        <User size={20} className="text-gray-400" />
                     )}
                   </div>
                   <div>
                      <p className="font-medium text-gray-900 dark:text-white">{bid.profiles?.full_name}</p>
                      <p className="text-xs text-gray-500">{new Date(bid.created_at).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-lg font-bold text-brand-blue flex items-center">
                    <IndianRupee size={16} />
                    {bid.amount}
                </div>
              </div>
              
              {/* Placeholder for Accept Logic */}
              <button 
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <Check size={16} />
                Accept Bid
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}