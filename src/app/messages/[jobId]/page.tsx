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

  const { data: job } = await supabase
    .from("jobs")
    .select(`
        id, 
        title, 
        status,
        owner_id, 
        assigned_provider_id,
        owner:profiles!owner_id (full_name),
        provider:profiles!assigned_provider_id (full_name)
    `)
    .eq("id", jobId)
    .single();

  if (!job) notFound();

  const isParticipant = job.owner_id === user.id || job.assigned_provider_id === user.id;
  if (!isParticipant) redirect("/");

  const unwrap = (data: any) => Array.isArray(data) ? data[0] : data;

  const otherName = job.owner_id === user.id 
    ? unwrap(job.provider)?.full_name 
    : unwrap(job.owner)?.full_name;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  const isOwner = job.owner_id === user.id;
  const showComplete = isOwner && job.status === 'in_progress';

  return (
    <div className="flex h-dvh flex-col bg-gray-50 dark:bg-black pb-16">
      <header className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800 z-10">
        <Link href="/messages" className="text-gray-600 dark:text-gray-400">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-brand-blue truncate">{otherName || "User"}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{job.title}</p>
            {job.status === 'completed' && (
              <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Completed
              </span>
            )}
          </div>
        </div>
        
        {showComplete && <CompleteJobButton jobId={jobId} />}
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