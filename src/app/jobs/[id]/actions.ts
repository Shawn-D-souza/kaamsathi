"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function placeBid(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const jobId = formData.get("job_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const proposalRaw = formData.get("proposal") as string;
  
  const proposalText = proposalRaw?.trim() || null;

  if (!amount || amount <= 0) {
    return { error: "Please enter a valid amount." };
  }

  const { data: existingBid } = await supabase
    .from("bids")
    .select("id")
    .eq("job_id", jobId)
    .eq("bidder_id", user.id)
    .single();

  if (existingBid) {
    return { error: "You have already placed a bid on this job." };
  }

  const { error } = await supabase.from("bids").insert({
    job_id: jobId,
    bidder_id: user.id,
    amount: amount,
    proposal_text: proposalText,
    status: "pending",
  });

  if (error) {
    console.error("Bid Error:", error);
    return { error: "Failed to place bid. Please try again." };
  }

  redirect("/my-jobs");
}

export type ReviewInput = {
  providerId: string;
  rating: number;
  comment?: string;
};

export async function completeJob(jobId: string, reviews: ReviewInput[] = []) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // 1. Verify Owner & Status
  const { data: job } = await supabase
    .from("jobs")
    .select("owner_id, status")
    .eq("id", jobId)
    .single();

  if (!job || job.owner_id !== user.id) {
    return { error: "Unauthorized" };
  }

  if (job.status === "completed") {
     return { error: "Job is already completed" };
  }

  // 2. Insert Reviews (if any)
  if (reviews.length > 0) {
    const reviewInserts = reviews.map((r) => ({
      job_id: jobId,
      reviewer_id: user.id,
      reviewee_id: r.providerId,
      rating: r.rating,
      comment: r.comment?.trim() || null,
    }));

    const { error: reviewError } = await supabase
      .from("reviews")
      .insert(reviewInserts);

    if (reviewError) {
      console.error("Review Error:", reviewError);
      return { error: "Failed to save reviews. Please try again." };
    }
  }

  // 3. Update Job Status
  const { error } = await supabase
    .from("jobs")
    .update({ status: "completed" })
    .eq("id", jobId);

  if (error) {
    console.error("Complete Job Error:", error);
    // Ideally we would rollback reviews here if this fails, but for MVP strict sequential is acceptable
    return { error: "Failed to complete job" };
  }

  revalidatePath("/");
  revalidatePath("/my-jobs");
  revalidatePath("/messages");
  revalidatePath(`/messages/${jobId}`);
  revalidatePath(`/jobs/${jobId}`);
  
  return { success: true };
}