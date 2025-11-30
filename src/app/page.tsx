import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import JobCard from "@/components/JobCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-6 bg-gray-50 dark:bg-black">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-center">
          <h1 className="text-3xl font-bold text-brand-blue mb-4">
            KaamSaathi
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
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
    <div className="min-h-dvh bg-gray-50 dark:bg-black">
      {/* Main Content Container */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        {/* Header - Standardized to match My Jobs & Messages */}
        <h1 className="mb-6 text-2xl font-bold text-brand-blue">
          {isSeeker ? "My Postings" : "Job Feed"}
        </h1>

        {/* Feed Content */}
        {jobs.length === 0 ? (
          <div className="mt-12 text-center rounded-2xl border-2 border-dashed border-gray-200 p-12 dark:border-zinc-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
              {isSeeker ? <Search className="text-gray-400" /> : <MapPin className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isSeeker ? "No jobs posted yet" : "No matching jobs found"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
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
                className="mt-4 inline-block rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-300"
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