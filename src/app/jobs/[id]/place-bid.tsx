"use client";

import { useActionState } from "react";
import { placeBid } from "./actions";
import { Loader2, IndianRupee } from "lucide-react";

export default function PlaceBidForm({ jobId }: { jobId: string }) {
  const [state, action, isPending] = useActionState(placeBid, { error: "" });

  return (
    <form action={action} className="mt-6 border-t border-gray-100 pt-6 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-brand-blue mb-4">Place Your Bid</h3>
      
      {state?.error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IndianRupee className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="hidden"
            name="job_id"
            value={jobId}
          />
          <input
            type="number"
            name="amount"
            required
            placeholder="Your Offer"
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-orange px-6 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Bid"}
        </button>
      </div>
    </form>
  );
}