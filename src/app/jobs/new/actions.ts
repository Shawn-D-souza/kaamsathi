"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createJob(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Check Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post a job." };
  }

  // 2. Check Role (Security redundancy)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "seeker") {
    return { error: "Only users in 'Seeker' mode can post jobs." };
  }

  // 3. Extract and Validate Data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budget = parseFloat(formData.get("budget") as string);
  const deadline = formData.get("deadline") as string;
  const category = formData.get("category") as string;

  if (!title || !description || !budget || !deadline || !category) {
    return { error: "All fields are required." };
  }

  if (budget <= 0) {
    return { error: "Budget must be greater than 0." };
  }

  if (new Date(deadline) < new Date()) {
    return { error: "Deadline cannot be in the past." };
  }

  // 4. Insert into Database
  const { error } = await supabase.from("jobs").insert({
    owner_id: user.id,
    title,
    description,
    budget,
    deadline,
    category,
    status: "open",
  });

  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Failed to post job. Please try again." };
  }

  // 5. Redirect on Success
  redirect("/");
}