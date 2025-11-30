"use client";

import { useState, useEffect } from "react";
import { Star, X, User, CheckCircle2, Loader2 } from "lucide-react";
import { completeJob, type ReviewInput } from "@/app/jobs/[id]/actions";

type Provider = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

type Props = {
  jobId: string;
  providers: Provider[];
  isOpen: boolean;
  onClose: () => void;
};

export default function ReviewModal({ jobId, providers, isOpen, onClose }: Props) {
  // State for the "Master" controls
  const [masterRating, setMasterRating] = useState(0);
  const [masterComment, setMasterComment] = useState("");

  // State for individual reviews (Mapped by Provider ID)
  const [reviews, setReviews] = useState<Record<string, { rating: number; comment: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize review state when providers load
  useEffect(() => {
    const initial: Record<string, { rating: number; comment: string }> = {};
    providers.forEach((p) => {
      initial[p.id] = { rating: 0, comment: "" };
    });
    setReviews(initial);
  }, [providers]);

  // Handler: Apply Master Rating to All
  const applyMasterToAll = () => {
    const updated = { ...reviews };
    providers.forEach((p) => {
      updated[p.id] = {
        rating: masterRating,
        comment: masterComment,
      };
    });
    setReviews(updated);
  };

  // Handler: Individual Updates
  const updateIndividual = (id: string, field: "rating" | "comment", value: any) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Validation: Check if everyone has at least 1 star
  const isValid = providers.every((p) => (reviews[p.id]?.rating || 0) > 0);

  // Submit Handler
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    // Convert Map to Array for Server Action
    const payload: ReviewInput[] = providers.map((p) => ({
      providerId: p.id,
      rating: reviews[p.id].rating,
      comment: reviews[p.id].comment,
    }));

    const result = await completeJob(jobId, payload);

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      onClose(); // Close modal on success (Page will refresh via Server Action)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 sm:items-center animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-zinc-900 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Complete Job</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Rate your experience to release payment.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          
          {/* MASTER CONTROL (Only show if > 1 provider) */}
          {providers.length > 1 && (
            <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <h3 className="mb-3 text-sm font-bold text-brand-blue flex items-center gap-2">
                <CheckCircle2 size={16} /> Rate Everyone
              </h3>
              
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMasterRating(star)}
                    className={`p-1 transition-transform hover:scale-110 ${
                      star <= masterRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-zinc-600"
                    }`}
                  >
                    <Star size={24} className={star <= masterRating ? "fill-current" : ""} />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Write a review for everyone..."
                rows={2}
                value={masterComment}
                onChange={(e) => setMasterComment(e.target.value)}
                className="w-full rounded-lg border-transparent bg-white p-3 text-sm focus:border-brand-blue focus:ring-brand-blue dark:bg-zinc-900 dark:text-white"
              />

              <button
                onClick={applyMasterToAll}
                className="mt-3 w-full rounded-lg bg-brand-blue py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Apply to All {providers.length} Providers
              </button>
            </div>
          )}

          {/* INDIVIDUAL LIST */}
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="rounded-xl border border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                    {provider.avatar_url ? (
                      <img src={provider.avatar_url} alt={provider.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{provider.full_name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-500">Hired Provider</p>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateIndividual(provider.id, "rating", star)}
                        className={`transition-colors ${
                          star <= (reviews[provider.id]?.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 dark:text-zinc-700"
                        }`}
                      >
                        <Star size={20} className={star <= (reviews[provider.id]?.rating || 0) ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                   <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 pt-2">Review</span>
                   <textarea
                    value={reviews[provider.id]?.comment || ""}
                    onChange={(e) => updateIndividual(provider.id, "comment", e.target.value)}
                    placeholder={`How was working with ${provider.full_name.split(' ')[0]}?`}
                    rows={2}
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm focus:border-brand-blue focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 dark:border-zinc-800">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Finish Job & Send Reviews
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}