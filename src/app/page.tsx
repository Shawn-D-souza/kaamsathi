import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Search, MapPin } from "lucide-react";
import JobCard from "@/components/JobCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Public Landing Page (Logged Out)
  if (!user) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center p-6 bg-gray-50 dark:bg-black">
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
              className="block w-full rounded-lg bg-brand-orange px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. Dashboard (Logged In)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const isSeeker = profile?.role === 'seeker';

  let jobs: any[] = [];

  if (isSeeker) {
    // Seekers: See their own posted jobs
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    jobs = data || [];
  } else {
    // Providers: See "Relevant" jobs (Remote + Within Service Zones)
    // We use the RPC function we created in the database
    const { data, error } = await supabase
      .rpc('get_relevant_jobs', { p_provider_id: user.id });
    
    if (error) {
      console.error("Error fetching feed:", error);
    }
    jobs = data || [];
  }

  return (
    <main className="min-h-dvh bg-gray-50 pb-24 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-6 py-4 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-blue">
              {isSeeker ? "My Jobs" : "Job Feed"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isSeeker ? "Manage your postings" : "Jobs matching your zones"}
            </p>
          </div>
          
          {isSeeker && (
            <Link
              href="/jobs/new"
              className="flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Post
            </Link>
          )}
        </div>
      </header>

      {/* Feed */}
      <div className="p-6">
        {jobs.length === 0 ? (
          <div className="mt-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
              {isSeeker ? <Search className="text-gray-400" /> : <MapPin className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isSeeker ? "No jobs posted yet" : "No matching jobs found"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              {isSeeker 
                ? "Create your first job posting to get started." 
                : "Try adding more 'Service Zones' in your profile to see local jobs, or wait for remote work."}
            </p>
            
            {isSeeker ? (
               <Link
               href="/jobs/new"
               className="mt-4 inline-block rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
             >
               Post a Job
             </Link>
            ) : (
                <Link
                href="/profile/locations"
                className="mt-4 inline-block rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-300"
              >
                Manage Zones
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isOwner={isSeeker} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}