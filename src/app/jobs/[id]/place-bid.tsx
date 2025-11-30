"use client";

import { useActionState } from "react";
import { placeBid } from "./actions";
import { Loader2, IndianRupee, FileText, Send } from "lucide-react";

export default function PlaceBidForm({ jobId }: { jobId: string }) {
  const [state, action, isPending] = useActionState(placeBid, { error: "" });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Apply for this Job
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Send a competitive bid. You can also explain why you're a good fit.
        </p>
      </div>

      <form action={action} className="space-y-5">
        {state?.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
            {state.error}
          </div>
        )}

        <input type="hidden" name="job_id" value={jobId} />

        {/* Proposal Text Area */}
        <div className="space-y-2">
          <label 
            htmlFor="proposal" 
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            <FileText size={14} />
            Pitch <span className="text-[10px] font-normal text-gray-400 normal-case">(Optional)</span>
          </label>
          <textarea
            name="proposal"
            id="proposal"
            rows={3}
            placeholder="Briefly describe your relevant experience..."
            className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-zinc-700 dark:bg-transparent dark:text-white dark:placeholder-zinc-400 dark:focus:border-brand-blue"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label 
            htmlFor="amount" 
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            <IndianRupee size={14} />
            Your Offer
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400 font-semibold">₹</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              min="1"
              placeholder="e.g. 100"
              className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 pr-3 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-zinc-700 dark:bg-transparent dark:text-white dark:placeholder-zinc-400 dark:focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Place Bid
            </>
          )}
        </button>
      </form>
    </div>
  );
}