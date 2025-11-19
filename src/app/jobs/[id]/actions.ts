"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function placeBid(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const jobId = formData.get("job_id") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!amount || amount <= 0) {
    return { error: "Please enter a valid amount" };
  }

  // Check if already bid
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
    status: "pending",
  });

  if (error) {
    console.error("Bid Error:", error);
    return { error: "Failed to place bid." };
  }

  redirect("/my-jobs");
}