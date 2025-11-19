import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatRoom from "./chat-room";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ChatPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Use Explicit Foreign Key syntax: alias:table!column_name
  const { data: job } = await supabase
    .from("jobs")
    .select(`
        id, 
        title, 
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

  return (
    <div className="flex h-dvh flex-col bg-gray-50 dark:bg-black pb-16">
      <header className="flex items-center gap-4 bg-white px-4 py-3 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800 z-10">
        <Link href="/messages" className="text-gray-600 dark:text-gray-400">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-brand-blue">{otherName || "User"}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{job.title}</p>
        </div>
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