import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Globe, MapPin, 
  CheckCircle, MessageSquare, LayoutGrid, User 
} from "lucide-react";
import JobCard from "@/components/JobCard";

// --- COMPONENTS ---

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group p-8 rounded-3xl card-surface hover:border-brand-blue/30 transition-all duration-300">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted leading-relaxed">{desc}</p>
  </div>
);

// --- MAIN PAGE ---

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. UNAUTHENTICATED LANDING PAGE
  if (!user) {
    return (
      <div className="h-dvh overflow-hidden lg:h-auto lg:overflow-auto lg:min-h-screen flex flex-col selection:bg-brand-orange/20">
        
        {/* MOBILE HEADER - Safe Area Preserved */}
        <div className="flex-none flex items-center justify-between p-6 pt-[calc(0.1rem+env(safe-area-inset-top))] lg:hidden z-50">
           <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-brand-blue">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-blue-500/20">
                 <Image 
                   src="/logo.png" 
                   alt="KaamSaathi" 
                   fill 
                   className="object-cover" 
                 />
              </div>
              KaamSaathi
           </div>
           <Link href="/auth" className="p-2 -mr-2 text-muted hover:text-brand-blue active:scale-95 transition-transform">
             <User size={26} />
           </Link>
        </div>

        {/* HERO SECTION */}
        <section className="flex-1 flex flex-col justify-center lg:block relative lg:pt-16 lg:pb-0 overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl relative z-10 h-full flex flex-col justify-center lg:block">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
              
              {/* Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.0] mb-6">
                  Get help with <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-sky-500">
                    anything.
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted mb-10 max-w-sm mx-auto lg:max-w-2xl lg:mx-0 leading-relaxed font-medium">
                  The simplest way to hire local help or find remote gigs. Verified neighbors, instant matches.
                </p>
                
                <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row justify-center lg:justify-start">
                  <Link href="/auth" className="btn-primary w-full sm:w-auto text-lg py-4 px-8 rounded-full">
                    Post a Job
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  
                  <Link href="/auth" className="btn-secondary w-full sm:w-auto text-lg py-4 px-8 rounded-full">
                    Find Work
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-12 flex justify-center gap-8 text-sm font-semibold text-muted lg:hidden">
                   <Link href="/legal/terms" className="hover:text-foreground p-2">Terms</Link>
                   <Link href="/legal/privacy" className="hover:text-foreground p-2">Privacy</Link>
                </div>

                <div className="hidden lg:flex mt-12 items-center gap-6 text-sm font-semibold text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" /> Direct Chat
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" /> Verified Users
                  </div>
                </div>
              </div>

              {/* Visuals */}
              <div className="hidden lg:flex lg:w-1/2 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto h-[600px] items-center justify-center">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl opacity-60" />
                 
                 <div className="relative w-full h-full max-w-md mx-auto">
                    <div className="absolute top-[20%] left-0 right-0 p-5 card-surface rounded-2xl z-10 transform rotate-[-2deg] transition-transform hover:rotate-0">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                             <MapPin size={20} className="text-brand-orange" />
                          </div>
                          <div className="flex-1">
                             <div className="h-2.5 w-24 bg-slate-900 dark:bg-slate-200 rounded-full mb-2"></div>
                             <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mb-1"></div>
                             <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                          </div>
                       </div>
                       <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="badge-success">Open for Bids</div>
                          <div className="text-xs font-bold text-muted">Just now</div>
                       </div>
                    </div>

                    <div className="absolute top-[5%] right-[-10%] p-4 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 animate-[bounce_4s_infinite] z-20">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full text-green-600"><CheckCircle size={18} /></div>
                          <div>
                             <p className="text-[10px] font-bold text-muted uppercase">Update</p>
                             <p className="font-bold text-sm">Bid Accepted</p>
                          </div>
                       </div>
                    </div>

                    <div className="absolute bottom-[25%] left-[-5%] p-4 bg-slate-900 text-white shadow-xl rounded-2xl animate-[bounce_5s_infinite] z-20 delay-700">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-full"><MessageSquare size={18} /></div>
                          <div>
                             <p className="text-[10px] font-bold text-white/60 uppercase">New Message</p>
                             <p className="font-bold text-white text-sm">"I can help with that!"</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="hidden lg:block py-16 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Why KaamSaathi?</h2>
              <p className="text-muted text-lg">We bridge the gap between local skills and everyday needs.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard 
                 icon={Zap} 
                 title="Instant Matching" 
                 desc="Our location-based matching helps you find the right people nearby in seconds." 
               />
               <FeatureCard 
                 icon={ShieldCheck} 
                 title="Verified & Safe" 
                 desc="Chat directly with community members. View ratings and reviews before you commit." 
               />
               <FeatureCard 
                 icon={Globe} 
                 title="Local & Remote" 
                 desc="Whether you need physical help moving furniture or digital help with code, we handle both." 
               />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hidden lg:block py-12 border-t border-slate-100 dark:border-slate-800">
           <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="font-bold text-xl flex items-center gap-2">
                <Zap size={18} className="text-brand-blue" fill="currentColor" /> KaamSaathi
              </div>
              <div className="flex gap-8 text-sm text-muted font-medium">
                 <Link href="/legal/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
                 <Link href="/legal/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
              </div>
              <p className="text-xs text-muted">© {new Date().getFullYear()} KaamSaathi</p>
           </div>
        </footer>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const isSeeker = profile?.role === 'seeker';
  let jobs: any[] = [];

  if (isSeeker) {
    const { data } = await supabase.from("jobs").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    jobs = data || [];
  } else {
    const { data, error } = await supabase.rpc('get_relevant_jobs', { p_provider_id: user.id });
    if (error) console.error("Error fetching feed:", error);
    jobs = data || [];
  }

  return (
    // REDUCED PADDING: 
    // - Changed 1.5rem to 0.2rem (almost flush with status bar safety area)
    // - md:pt-0 handles desktop reset
    <div className="min-h-dvh pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      
      {/* - Reduced vertical padding from py-8 to py-4 
        - Maintained md:pt-24 for Desktop Fixed Header clearance 
      */}
      <div className="mx-auto max-w-screen-2xl px-6 py-4 md:pt-24 pb-8">
        <div className="flex justify-between items-end mb-6">
           <div>
             <h1 className="text-3xl font-extrabold tracking-tight">
               {isSeeker ? "My Postings" : "Job Feed"}
             </h1>
           </div>
           
           {isSeeker && (
             <Link href="/jobs/new" className="hidden sm:inline-flex btn-primary gap-2 rounded-full">
                <Zap size={18} /> Post New Job
             </Link>
           )}
        </div>

        {jobs.length === 0 ? (
          <div className="mt-8 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 card-surface">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
              {isSeeker ? <LayoutGrid className="text-muted" size={32} /> : <MapPin className="text-muted" size={32} />}
            </div>
            <h3 className="text-xl font-bold">
              {isSeeker ? "No jobs posted yet" : "No jobs nearby"}
            </h3>
            <p className="mt-2 text-muted max-w-sm mx-auto leading-relaxed">
              {isSeeker 
                ? "Create your first job listing to start receiving bids." 
                : "Try expanding your Service Zones radius or check back later."}
            </p>
            
            {isSeeker ? (
               <Link href="/jobs/new" className="mt-8 inline-flex btn-primary gap-2 rounded-full">
                 Create Job <ArrowRight size={18} />
               </Link>
            ) : (
               <Link href="/profile/locations" className="mt-8 inline-flex btn-secondary gap-2 rounded-full">
                 Adjust Zones <ArrowRight size={16} />
               </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isOwner={isSeeker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}