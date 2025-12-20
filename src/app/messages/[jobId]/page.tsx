import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatRoom from "./chat-room";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CompleteJobButton from "./complete-button";

export default async function ChatPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // 1. Fetch Job Info
  const { data: job } = await supabase
    .from("jobs")
    .select(`
        id, 
        title, 
        status,
        owner_id, 
        owner:profiles!owner_id (full_name)
    `)
    .eq("id", jobId)
    .single();

  if (!job) notFound();

  // 2. Fetch Participants (Owner + Accepted Bidders with Profiles)
  const { data: hiredBids } = await supabase
    .from("bids")
    .select(`
      bidder_id,
      profiles:bidder_id (id, full_name, avatar_url)
    `)
    .eq("job_id", jobId)
    .eq("status", "accepted");

  // Flatten the response structure
  const hiredProviders = hiredBids?.map((b: any) => b.profiles) || [];
  const hiredIds = hiredProviders.map((p: any) => p.id);
  
  const isOwner = job.owner_id === user.id;
  const isHiredProvider = hiredIds.includes(user.id);

  // 3. Access Control
  if (!isOwner && !isHiredProvider) {
    redirect("/");
  }

  // 4. Header Info
  const chatTitle = job.title; 
  const ownerData = Array.isArray(job.owner) ? job.owner[0] : job.owner;
  const ownerName = ownerData?.full_name || "Job Owner";
  
  const subTitle = isOwner 
    ? `${hiredIds.length} Person(s) Hired` 
    : `Posted by ${ownerName}`;

  // 5. Fetch Messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  const showComplete = isOwner && job.status === 'in_progress';

  return (
    <div className="flex h-dvh flex-col bg-gray-50 dark:bg-black pb-16 pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-16">
      <header className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800 z-10">
        <Link href="/messages" className="text-gray-600 dark:text-gray-400">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-brand-blue truncate">{chatTitle}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
              {subTitle}
            </p>
            {job.status === 'completed' && (
              <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Completed
              </span>
            )}
          </div>
        </div>
        
        {showComplete && (
          <CompleteJobButton 
            jobId={jobId} 
            providers={hiredProviders}
          />
        )}
      </header>

      <div className="flex-1 overflow-hidden">
         <ChatRoom 
            jobId={jobId} 
            userId={user.id} 
            initialMessages={messages || []} 
         />
      </div>
    </div>
  );
}