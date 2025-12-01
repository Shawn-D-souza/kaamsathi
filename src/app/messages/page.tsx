import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, Briefcase, ChevronRight } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // 1. Fetch Jobs where I am the Owner (My Jobs)
  const { data: ownerJobs } = await supabase
    .from("jobs")
    .select(`
      id, title, status, updated_at, owner_id, quantity,
      owner:profiles!owner_id (full_name, avatar_url)
    `)
    .eq("owner_id", user.id)
    .in('status', ['in_progress', 'completed'])
    .order('updated_at', { ascending: false });

  // 2. Fetch Jobs where I am the Hired Provider (My Work)
  const { data: myBids } = await supabase
    .from("bids")
    .select(`
      job:jobs (
        id, title, status, updated_at, owner_id, quantity,
        owner:profiles!owner_id (full_name, avatar_url)
      )
    `)
    .eq("bidder_id", user.id)
    .eq("status", "accepted");

  const providerJobs = myBids?.map((bid: any) => bid.job) || [];

  // 3. Merge and Sort by recency
  const allConversations = [...(ownerJobs || []), ...providerJobs]
    .filter(Boolean)
    .filter((job, index, self) => index === self.findIndex((t) => t.id === job.id))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const unwrap = (data: any) => Array.isArray(data) ? data[0] : data;

  return (
    <main className="min-h-dvh bg-gray-50/50 dark:bg-black">
      {/* Container widened to match other pages */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-brand-blue">Messages</h1>
        </header>

        {allConversations.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-zinc-800">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-900">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No messages yet</h3>
            <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Chats appear here when a job is accepted.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {allConversations.map((chat: any) => {
              const isOwner = chat.owner_id === user.id;
              const ownerProfile = unwrap(chat.owner);
              
              const displayName = isOwner ? "Job Team" : (ownerProfile?.full_name || "Job Owner");
              const avatarUrl = isOwner ? "" : ownerProfile?.avatar_url;

              return (
                <Link 
                  key={chat.id} 
                  href={`/messages/${chat.id}`}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-brand-blue/30 sm:hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-4">
                    
                    {/* Avatar */}
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        isOwner ? <Briefcase size={20} className="text-brand-blue" /> : <User size={20} className="text-gray-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-gray-900 truncate dark:text-white transition-colors sm:group-hover:text-brand-blue">
                            {chat.title}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-zinc-500">
                            {new Date(chat.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                          {isOwner ? `${chat.quantity || 1} Person Job` : `Posted by ${displayName}`}
                        </p>
                        
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                            chat.status === 'in_progress' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                            {chat.status === 'in_progress' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                    </div>

                    {/* Simple Chevron (No blue accent line) */}
                    <div className="hidden sm:block text-gray-300 transition-colors sm:group-hover:text-brand-blue">
                        <ChevronRight size={20} />
                    </div>

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