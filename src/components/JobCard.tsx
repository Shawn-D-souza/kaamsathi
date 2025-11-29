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
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div>
        {/* Header: Badges & Date */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-blue dark:bg-blue-900/20 dark:text-blue-300">
                <Tag size={10} />
                {job.category}
            </span>
            
            {job.is_remote ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Laptop size={10} />
                    Remote
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin size={10} />
                    In Person
                </span>
            )}
          </div>
          
          {isOwner && (
             <span className="text-[10px] font-medium text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full dark:bg-orange-900/20">
               Your Post
             </span>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-brand-blue dark:text-gray-100 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 dark:text-gray-400">
            {job.description}
          </p>
        </div>
      </div>

      {/* Footer: Meta Info */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-medium">Budget</span>
          <div className="flex items-center gap-0.5 text-base font-bold text-gray-900 dark:text-white">
            <IndianRupee size={14} className="text-gray-400 mt-[1px]" />
            {job.budget.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 uppercase font-medium">Deadline</span>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
            <Clock size={14} />
            <span>{new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Arrow for Hover */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        <ChevronRight className="text-brand-blue/20" size={24} />
      </div>
    </Link>
  );
}