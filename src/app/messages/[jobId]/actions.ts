"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendMessage(jobId: string, content: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!content.trim()) return { error: "Message cannot be empty" };

  const { error } = await supabase
    .from("messages")
    .insert({
      job_id: jobId,
      sender_id: user.id,
      content: content.trim()
    });

  if (error) {
    console.error("Send Error:", error);
    return { error: "Failed to send message" };
  }

  // Update job timestamp so it bubbles to top of list
  await supabase
    .from("jobs")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", jobId);
}