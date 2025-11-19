import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: conversations } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      status,
      updated_at,
      owner_id,
      assigned_provider_id,
      owner:profiles!owner_id (full_name, avatar_url),
      provider:profiles!assigned_provider_id (full_name, avatar_url) 
    `)
    .or(`owner_id.eq.${user.id},assigned_provider_id.eq.${user.id}`)
    .in('status', ['in_progress', 'completed'])
    .order('updated_at', { ascending: false });

  const unwrap = (data: any) => Array.isArray(data) ? data[0] : data;

  return (
    <main className="min-h-dvh bg-gray-50 p-6 pb-24 dark:bg-black">
      <h1 className="mb-6 text-2xl font-bold text-brand-blue">Messages</h1>
      

      {!conversations || conversations.length === 0 ? (
        <div className="mt-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
            <MessageSquare className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Chats appear here when a job is accepted.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((chat: any) => {
            const isOwner = chat.owner_id === user.id;
            const otherUser = isOwner ? unwrap(chat.provider) : unwrap(chat.owner);

            const displayName = otherUser?.full_name || (isOwner ? 'Provider' : 'Owner');
            const avatarUrl = otherUser?.avatar_url || "";

            return (
              <Link 
                key={chat.id} 
                href={`/messages/${chat.id}`}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden dark:bg-zinc-800">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {displayName}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                        {new Date(chat.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    Job: {chat.title}
                  </p>
                  <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                      chat.status === 'in_progress' 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                      {chat.status === 'in_progress' ? 'Active' : 'Completed'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}