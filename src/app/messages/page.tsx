import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, Briefcase, ChevronRight } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: ownerJobs } = await supabase.from("jobs").select(`id, title, status, updated_at, owner_id, quantity, owner:profiles!owner_id (full_name, avatar_url)`).eq("owner_id", user.id).in('status', ['in_progress', 'completed']).order('updated_at', { ascending: false });
  const { data: myBids } = await supabase.from("bids").select(`job:jobs (id, title, status, updated_at, owner_id, quantity, owner:profiles!owner_id (full_name, avatar_url))`).eq("bidder_id", user.id).eq("status", "accepted");

  const providerJobs = myBids?.map((bid: any) => bid.job) || [];
  const allConversations = [...(ownerJobs || []), ...providerJobs].filter(Boolean).filter((job, index, self) => index === self.findIndex((t) => t.id === job.id)).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  const unwrap = (data: any) => Array.isArray(data) ? data[0] : data;

  return (
  <main className="min-h-dvh pb-24 pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      <div className="mx-auto max-w-screen-2xl px-6 py-4 md:pt-24">
        
        <header className="mb-6"><h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Messages</h1></header>

        {allConversations.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--card-border)] p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm"><MessageSquare className="h-8 w-8 text-gray-400" /></div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">No messages yet</h3>
            <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">Chats appear here when a job is accepted.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allConversations.map((chat: any) => {
              const isOwner = chat.owner_id === user.id;
              const ownerProfile = unwrap(chat.owner);
              const displayName = isOwner ? "Job Team" : (ownerProfile?.full_name || "Job Owner");
              const avatarUrl = isOwner ? "" : ownerProfile?.avatar_url;

              return (
                <Link key={chat.id} href={`/messages/${chat.id}`} className="card-surface group relative block w-full overflow-hidden rounded-2xl p-4 transition-all hover:scale-[1.01] hover:border-brand-blue/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700">
                      {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : (isOwner ? <Briefcase size={20} className="text-brand-blue" /> : <User size={20} className="text-gray-400" />)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-[var(--foreground)] truncate transition-colors group-hover:text-brand-blue">{chat.title}</h3>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--muted)]">{new Date(chat.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-[var(--muted)] truncate">{isOwner ? `${chat.quantity || 1} Person Job` : `Posted by ${displayName}`}</p>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${chat.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>{chat.status === 'in_progress' ? 'Active' : 'Completed'}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block text-gray-300 transition-colors group-hover:text-brand-blue"><ChevronRight size={20} /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}