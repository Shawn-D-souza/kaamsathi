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
  
  // Format date nicely (e.g., "Oct 24")
  const formattedDate = new Date(job.deadline).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Link 
      href={`/jobs/${job.id}`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-brand-blue/30 sm:hover:shadow-lg sm:active:scale-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        
        {/* LEFT: Main Content */}
        <div className="flex-1 space-y-3">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                <Tag size={10} className="mr-1" />
                {job.category}
            </span>
            
            {job.is_remote ? (
                <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Laptop size={10} className="mr-1" />
                    Remote
                </span>
            ) : (
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin size={10} className="mr-1" />
                    On-Site
                </span>
            )}

            {isOwner && (
               <span className="ml-auto rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange dark:bg-orange-900/20 sm:ml-0">
                 Your Post
               </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors sm:group-hover:text-brand-blue dark:text-gray-50">
              {job.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {job.description}
            </p>
          </div>
        </div>

        {/* RIGHT: Meta Info (Budget/Deadline) */}
        <div className="mt-2 flex shrink-0 items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-800 sm:mt-0 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          
          {/* Budget */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Budget</span>
            <div className="flex items-center gap-0.5 text-lg font-bold text-gray-900 dark:text-white">
              <IndianRupee size={16} className="mt-[2px] text-gray-400" />
              {job.budget.toLocaleString()}
            </div>
          </div>

          {/* Deadline */}
          <div className="flex flex-col items-end sm:mt-3">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:block">Deadline</span>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Hover Indicator (Desktop Only) */}
      <div className="absolute inset-y-0 left-0 w-1 scale-y-0 bg-brand-blue transition-transform duration-300 ease-out sm:group-hover:scale-y-100"></div>
    </Link>
  );
}