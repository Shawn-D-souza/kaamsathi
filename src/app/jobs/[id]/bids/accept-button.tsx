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
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      {isPending ? "Accepting..." : "Accept Bid"}
    </button>
  );
}