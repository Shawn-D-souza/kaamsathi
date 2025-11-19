"use client";

import { useActionState } from "react";
import { createJob } from "./actions";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const initialState = {
  error: "",
};

export default function PostJobForm() {
  const [state, action, isPending] = useActionState(createJob, initialState);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 p-6 pb-24 dark:bg-black">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-2xl font-bold text-brand-blue">Post a Job</h1>
      </div>

      {/* Form Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <form action={action} className="space-y-6">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {state.error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="e.g. Need help with Calculus assignment"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              id="category"
              required
              defaultValue=""
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
            >
              <option value="" disabled>Select a category</option>
              <option value="assignment">Assignment Help</option>
              <option value="tutoring">Tutoring</option>
              <option value="delivery">Delivery/Errands</option>
              <option value="tech">Tech Support</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              placeholder="Describe exactly what you need..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
            />
          </div>

          {/* Budget & Deadline Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                id="budget"
                required
                min="1"
                step="0.01"
                placeholder="500"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                id="deadline"
                required
                min={minDate}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white sm:text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-md bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Job"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}