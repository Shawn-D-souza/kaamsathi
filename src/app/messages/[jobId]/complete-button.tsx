"use client";

import { useTransition } from "react";
import { completeJob } from "@/app/jobs/[id]/actions";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CompleteJobButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    if (!confirm("Are you sure you want to mark this job as complete? This action cannot be undone.")) return;

    startTransition(async () => {
      const result = await completeJob(jobId);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isPending}
      className="ml-auto flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
      {isPending ? "Completing..." : "Mark Done"}
    </button>
  );
}