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
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-brand-blue/10 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-brand-blue dark:bg-blue-900/20 dark:text-blue-300">
                <Tag size={12} />
                <span className="capitalize">{job.category}</span>
            </span>
            
            {/* Location Badge */}
            {job.is_remote ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Laptop size={12} />
                    <span>Remote</span>
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <MapPin size={12} />
                    <span>In Person</span>
                </span>
            )}
          </div>
          
          <span className="text-[10px] text-gray-400 dark:text-zinc-500">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {job.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {job.description}
        </p>
      </div>

      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 dark:border-zinc-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
            <IndianRupee size={16} className="text-gray-400" />
            {job.budget}
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            <span className="text-xs">
              {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <Link 
          href={`/jobs/${job.id}`}
          className="block w-full rounded-lg bg-gray-50 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
        >
          {isOwner ? "Manage Job" : "View Details"}
        </Link>
      </div>
    </div>
  );
}