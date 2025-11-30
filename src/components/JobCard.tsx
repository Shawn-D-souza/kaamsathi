import { IndianRupee, Clock, Tag, MapPin, Laptop, ChevronRight } from "lucide-react";
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

  return (
    <Link 
      href={`/jobs/${job.id}`}
      className="group relative block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:p-6"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 space-y-4">
          
          {/* Header: Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-blue dark:bg-blue-900/20 dark:text-blue-300">
                <Tag size={10} />
                {job.category}
            </span>
            
            {job.is_remote ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Laptop size={10} />
                    Remote
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin size={10} />
                    In Person
                </span>
            )}

            {isOwner && (
               <span className="ml-auto rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-brand-orange dark:bg-orange-900/20 md:ml-0">
                 Your Post
               </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-blue dark:text-gray-50 md:text-xl">
              {job.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base">
              {job.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Meta Info (Budget/Deadline) */}
        {/* On Mobile: Row at bottom. On Desktop: Column at right. */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800 md:w-48 md:flex-col md:items-end md:justify-start md:border-l md:border-t-0 md:pl-6 md:pt-0">
          
          <div className="flex flex-col md:items-end">
            <span className="text-[10px] font-medium uppercase text-gray-400">Budget</span>
            <div className="flex items-center gap-0.5 text-lg font-bold text-gray-900 dark:text-white md:text-xl">
              <IndianRupee size={16} className="mt-[2px] text-gray-400" />
              {job.budget.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col items-end md:mt-4">
            <span className="text-[10px] font-medium uppercase text-gray-400">Deadline</span>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              <Clock size={14} />
              <span>{new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Subtle Hover Indicator */}
      <div className="absolute inset-y-0 -left-px w-1 scale-y-0 bg-brand-blue transition-transform duration-200 group-hover:scale-y-100 rounded-l-xl"></div>
    </Link>
  );
}