import { IndianRupee, Clock, Tag, MapPin, Laptop } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  created_at: string;
  is_remote: boolean;
}

export default function JobCard({ job, isOwner }: { job: Job; isOwner?: boolean }) {
  const isExpired = new Date(job.deadline) < new Date();
  
  const formattedDate = new Date(job.deadline).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Link 
      href={`/jobs/${job.id}`}
      className="card-surface group relative block w-full overflow-hidden rounded-2xl p-5 hover:border-brand-blue/30"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        
        {/* LEFT: Main Content */}
        <div className="flex-1 space-y-3">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-neutral uppercase tracking-wide">
                <Tag size={10} className="mr-1" />
                {job.category}
            </span>
            
            {job.is_remote ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                    <Laptop size={10} className="mr-1" />
                    Remote
                </span>
            ) : (
                <span className="badge-success uppercase tracking-wide">
                    <MapPin size={10} className="mr-1" />
                    On-Site
                </span>
            )}

            {isOwner && (
               <span className="ml-auto rounded-full bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 sm:ml-0">
                 Your Post
               </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-brand-blue">
              {job.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
              {job.description}
            </p>
          </div>
        </div>

        {/* RIGHT: Meta Info (Budget/Deadline) */}
        <div className="mt-2 flex shrink-0 items-center justify-between border-t border-[var(--card-border)] pt-3 sm:mt-0 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          
          {/* Budget */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Budget</span>
            <div className="flex items-center gap-0.5 text-lg font-bold text-[var(--foreground)]">
              <IndianRupee size={16} className="mt-[2px] text-[var(--muted)]" />
              {job.budget.toLocaleString()}
            </div>
          </div>

          {/* Deadline */}
          <div className="flex flex-col items-end sm:mt-3">
            <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] sm:block">Deadline</span>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? 'text-red-500' : 'text-[var(--muted)]'}`}>
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Hover Indicator */}
      <div className="absolute inset-y-0 left-0 w-1 scale-y-0 bg-brand-blue transition-transform duration-300 ease-out group-hover:scale-y-100"></div>
    </Link>
  );
}