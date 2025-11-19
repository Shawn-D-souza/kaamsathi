import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PostJobForm from "./post-job-form";

export default async function PostJobPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // 2. Check Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 3. Redirect Providers immediately
  if (profile?.role !== "seeker") {
    redirect("/");
  }

  // 4. Render Form if allowed
  return <PostJobForm />;
}