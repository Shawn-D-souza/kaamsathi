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

  // 2. Update the Chosen Bid -> "accepted"
  const { error: acceptError } = await supabase
    .from("bids")
    .update({ status: "accepted" })
    .eq("id", bidId);

  if (acceptError) return { error: "Failed to update bid" };

  // 3. Update All Other Bids -> "rejected"
  // We don't stop the process if this fails, but we log it.
  const { error: rejectError } = await supabase
    .from("bids")
    .update({ status: "rejected" })
    .eq("job_id", jobId)
    .neq("id", bidId); // Important: Don't reject the one we just accepted!

  if (rejectError) {
    console.error("Error rejecting other bids:", rejectError);
  }

  // 4. Update Job Status & Assign Provider
  const { error: jobError } = await supabase
    .from("jobs")
    .update({ 
      status: "in_progress",
      assigned_provider_id: providerId
    })
    .eq("id", jobId);

  if (jobError) return { error: "Failed to update job" };

  // 5. Revalidate paths to refresh UI
  revalidatePath(`/jobs/${jobId}/bids`);
  revalidatePath("/my-jobs");
  revalidatePath("/messages");
  
  redirect(`/messages/${jobId}`);
}