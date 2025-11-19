"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = formData.get("full_name") as string;
  // We get the avatar_url hidden input which is populated after client-side upload
  const avatarUrl = formData.get("avatar_url") as string;

  if (!fullName || fullName.trim().length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  const updateData: any = { full_name: fullName.trim() };
  if (avatarUrl) {
    updateData.avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: "Failed to update profile" };
  }

  revalidatePath("/profile");
  redirect("/profile");
}