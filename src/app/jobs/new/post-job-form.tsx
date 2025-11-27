"use client";

import { useActionState, useState } from "react";
import { createJob } from "./actions";
import { Loader2, ArrowLeft, MapPin, Laptop, Users, Calculator } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Lazy load the map to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading Map...
    </div>
  )
});

const initialState = {
  error: "",
};

export default function PostJobForm() {
  const [state, action, isPending] = useActionState(createJob, initialState);
  
  // Location State
  const [isRemote, setIsRemote] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState(1000); // Default 1km

  // Budget & Quantity State (For Total Calculation)
  const [budget, setBudget] = useState<string>("");
  // FIX: Initialize as string "1" to allow backspacing to empty string ""
  const [quantity, setQuantity] = useState<string>("1");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Format strictly as YYYY-MM-DDTHH:mm for datetime-local input
  const minDate = tomorrow.toISOString().slice(0, 16);

  // FIX: Safely parse quantity string to integer for calculation
  const totalCost = (parseFloat(budget) || 0) * (parseInt(quantity) || 0);

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

          {/* --- Job Type Toggle (Remote vs Local) --- */}
          <div className="rounded-lg border border-gray-200 p-1 dark:border-zinc-800 flex">
            <button
                type="button"
                onClick={() => setIsRemote(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    !isRemote 
                    ? "bg-brand-blue text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
            >
                <MapPin size={16} />
                In Person
            </button>
            <button
                type="button"
                onClick={() => setIsRemote(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    isRemote 
                    ? "bg-brand-blue text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
            >
                <Laptop size={16} />
                Remote
            </button>
          </div>

          <input type="hidden" name="is_remote" value={isRemote.toString()} />

          {/* --- Location Picker (Only if NOT Remote) --- */}
          {!isRemote && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Location
                    </label>
                    <LeafletMap 
                        interactive={true}
                        location={location}
                        radius={radius}
                        onLocationSelect={(lat, lng) => {
                            if (lat !== null && lng !== null) {
                                setLocation({ lat, lng });
                            } else {
                                setLocation(null);
                            }
                        }}
                    />
                    <input type="hidden" name="lat" value={location?.lat || ""} />
                    <input type="hidden" name="lng" value={location?.lng || ""} />
                </div>

                {/* Radius Slider */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="font-medium text-gray-700 dark:text-gray-300">
                            Visibility Radius
                        </label>
                        <span className="text-brand-blue font-semibold">
                            {(radius / 1000).toFixed(1)} km
                        </span>
                    </div>
                    <input 
                        type="range"
                        name="radius"
                        min="500"
                        max="10000"
                        step="100"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue dark:bg-zinc-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Job will be visible to providers within this circle.
                    </p>
                </div>
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
              placeholder={isRemote ? "e.g. Fix my Python script" : "e.g. Need help moving sofa"}
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

          {/* --- Multi-Hire Section --- */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4 text-brand-blue font-medium">
                <Calculator size={18} />
                <h3>Payment & Hiring</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Budget Per Person */}
                <div>
                    <label htmlFor="budget" className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Budget (Per Person)
                    </label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                            type="number"
                            name="budget"
                            id="budget"
                            required
                            min="1"
                            step="0.01"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="500"
                            className="block w-full rounded-md border border-gray-300 pl-7 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white"
                        />
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label htmlFor="quantity" className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                        Hires Needed <Users size={12} />
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        required
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue dark:border-gray-700 dark:bg-black dark:text-white"
                    />
                </div>
            </div>

            {/* Total Estimation */}
            {totalCost > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Estimated Cost:</span>
                    <span className="font-bold text-brand-orange text-lg">₹{totalCost.toFixed(2)}</span>
                </div>
            )}
          </div>

          {/* Deadline */}
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