"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptBid(jobId: string, bidId: string, providerId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // 1. Verify Owner & Get Job Details
  const { data: job } = await supabase
    .from("jobs")
    .select("owner_id, quantity, status")
    .eq("id", jobId)
    .single();

  if (!job || job.owner_id !== user.id) {
    return { error: "Unauthorized" };
  }

  if (job.status !== 'open') {
    return { error: "This job is no longer open for hiring." };
  }

  // 2. Count CURRENT accepted bids
  const { count: hiredCount, error: countError } = await supabase
    .from("bids")
    .select("*", { count: 'exact', head: true })
    .eq("job_id", jobId)
    .eq("status", "accepted");

  if (countError) return { error: "Failed to verify hiring limit." };

  const currentHires = hiredCount || 0;

  if (currentHires >= job.quantity) {
    return { error: "Hiring limit reached for this job." };
  }

  // 3. Update the Bid
  const { error: acceptError } = await supabase
    .from("bids")
    .update({ status: "accepted" })
    .eq("id", bidId);

  if (acceptError) return { error: "Failed to update bid" };

  // 4. Check if Job is NOW Full
  const newHireCount = currentHires + 1;
  const isJobFull = newHireCount >= job.quantity;

  if (isJobFull) {
    // Close the job
    await supabase.from("jobs").update({ status: "in_progress" }).eq("id", jobId);
    
    // Reject remaining pending bids
    await supabase.from("bids").update({ status: "rejected" }).eq("job_id", jobId).eq("status", "pending");
  } 

  // 5. Refresh UI (BUT DO NOT REDIRECT)
  revalidatePath(`/jobs/${jobId}/bids`);
  revalidatePath("/my-jobs");
  revalidatePath("/messages");
  
  // Return success status to the UI component
  return { success: true, isFull: isJobFull };
}