"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import ReviewModal from "./review-modal";

type Provider = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

export default function CompleteJobButton({ 
  jobId, 
  providers 
}: { 
  jobId: string; 
  providers: Provider[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-auto flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
      >
        <CheckCircle2 size={12} />
        Mark Done
      </button>

      <ReviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        jobId={jobId}
        providers={providers}
      />
    </>
  );
}