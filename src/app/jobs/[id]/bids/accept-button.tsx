"use client";

import { useTransition } from "react";
import { acceptBid } from "./actions";
import { Check, Loader2 } from "lucide-react";

export default function AcceptButton({ 
  jobId, 
  bidId, 
  providerId 
}: { 
  jobId: string; 
  bidId: string; 
  providerId: string 
}) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(() => {
      // Using .then() instead of await here satisfies the strict type requirement
      acceptBid(jobId, bidId, providerId).then((result) => {
        if (result?.error) {
          alert(result.error);
        }
      });
    });
  };

  return (
    <button
      onClick={handleAccept}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      {isPending ? "Accepting..." : "Accept Bid"}
    </button>
  );
}