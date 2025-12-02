import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import JobCard from "@/components/JobCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="card-surface rounded-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-brand-blue mb-4 tracking-tight">
              KaamSaathi
            </h1>
            <p className="text-[var(--muted)] mb-8 leading-relaxed">
              The peer-to-peer marketplace for students.
              <br />
              Find help locally or remote.
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/auth" 
                className="btn-primary w-full"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-xs text-[var(--muted)]">
            <Link href="/legal/terms" className="hover:text-[var(--primary)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="hover:text-[var(--primary)] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const isSeeker = profile?.role === 'seeker';

  let jobs: any[] = [];

  if (isSeeker) {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    jobs = data || [];
  } else {
    const { data, error } = await supabase
      .rpc('get_relevant_jobs', { p_provider_id: user.id });
    
    if (error) console.error("Error fetching feed:", error);
    jobs = data || [];
  }

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {isSeeker ? "My Postings" : "Home"}
        </h1>

        {jobs.length === 0 ? (
          <div className="mt-12 text-center rounded-2xl border-2 border-dashed border-[var(--card-border)] p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm">
              {isSeeker ? <Search className="text-gray-400" /> : <MapPin className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              {isSeeker ? "No jobs posted yet" : "No matching jobs found"}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-xs mx-auto">
              {isSeeker 
                ? "Create your first job posting to get started." 
                : "Try adding more 'Service Zones' in your profile to see local jobs."}
            </p>
            
            {isSeeker ? (
               <Link
               href="/jobs/new"
               className="btn-primary mt-6 inline-flex"
             >
               Post a Job
             </Link>
            ) : (
                <Link
                href="/profile/locations"
                className="btn-secondary mt-4 inline-block"
              >
                Manage Zones
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isOwner={isSeeker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}