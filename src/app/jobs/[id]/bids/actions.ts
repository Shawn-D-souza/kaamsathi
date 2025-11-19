"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function acceptBid(jobId: string, bidId: string, providerId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // 1. Verify Owner
  const { data: job } = await supabase
    .from("jobs")
    .select("owner_id")
    .eq("id", jobId)
    .single();

  if (!job || job.owner_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // 2. Update Bid Status
  const { error: bidError } = await supabase
    .from("bids")
    .update({ status: "accepted" })
    .eq("id", bidId);

  if (bidError) return { error: "Failed to update bid" };

  // 3. Reject other bids (Optional logic, skipping for simplicity)

  // 4. Update Job Status & Assign Provider
  const { error: jobError } = await supabase
    .from("jobs")
    .update({ 
      status: "in_progress",
      assigned_provider_id: providerId
    })
    .eq("id", jobId);

  if (jobError) return { error: "Failed to update job" };

  revalidatePath(`/jobs/${jobId}/bids`);
  revalidatePath("/my-jobs");
  revalidatePath("/messages");
  
  redirect(`/messages/${jobId}`);
}