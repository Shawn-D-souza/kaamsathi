"use client";

import { useActionState, useState } from "react";
import { createJob } from "./actions";
import { Loader2, ArrowLeft, MapPin, Laptop, Users, Calculator, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Lazy load the map
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-2xl bg-gray-50 dark:bg-zinc-800/50 animate-pulse flex items-center justify-center text-gray-400 text-sm">
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
  const [radius, setRadius] = useState(1000); 

  // Budget & Quantity State
  const [budget, setBudget] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  const totalCost = (parseFloat(budget) || 0) * (parseInt(quantity) || 0);

  return (
    <div className="min-h-dvh bg-gray-50/50 pb-24 dark:bg-black">
      {/* Fixed: Widened container to max-w-screen-2xl to remove side gaps */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">Post a Job</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Describe your task and find help.</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 dark:bg-zinc-900 dark:ring-zinc-800 md:p-8">
          <form action={action} className="space-y-8">
            
            {state?.error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <Info size={18} />
                {state.error}
              </div>
            )}

            {/* --- 1. Job Type Toggle --- */}
            <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Location Type
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1.5 dark:bg-zinc-800">
                    <button
                        type="button"
                        onClick={() => setIsRemote(false)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                            !isRemote 
                            ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-700 dark:text-white" 
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                        }`}
                    >
                        <MapPin size={18} />
                        In Person
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRemote(true)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                            isRemote 
                            ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-700 dark:text-white" 
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                        }`}
                    >
                        <Laptop size={18} />
                        Remote
                    </button>
                </div>
                <input type="hidden" name="is_remote" value={isRemote.toString()} />
            </div>

            {/* --- 2. Location Picker (Conditional) --- */}
            {!isRemote && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700">
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
                    </div>
                    <input type="hidden" name="lat" value={location?.lat || ""} />
                    <input type="hidden" name="lng" value={location?.lng || ""} />

                    {/* Radius Slider */}
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800/50">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Visibility Radius</span>
                            <span className="font-bold text-brand-blue">{(radius / 1000).toFixed(1)} km</span>
                        </div>
                        <input 
                            type="range"
                            name="radius"
                            min="500"
                            max="10000"
                            step="100"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-blue dark:bg-zinc-700"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Providers within this circle will see your job.
                        </p>
                    </div>
                </div>
            )}

            {/* --- 3. Job Details --- */}
            <div className="space-y-5">
                <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                        Job Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder={isRemote ? "e.g. Debug my React App" : "e.g. Help moving furniture"}
                        className="block w-full rounded-2xl border-0 bg-gray-50 px-4 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:focus:ring-brand-blue transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                id="category"
                                required
                                defaultValue=""
                                className="block w-full appearance-none rounded-2xl border-0 bg-gray-50 px-4 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700"
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="assignment">Assignment Help</option>
                                <option value="tutoring">Tutoring</option>
                                <option value="delivery">Delivery</option>
                                <option value="tech">Tech Support</option>
                                <option value="household">Household</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="deadline" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            id="deadline"
                            required
                            min={minDate}
                            className="block w-full rounded-2xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={5}
                        required
                        placeholder="Provide details about what needs to be done..."
                        className="block w-full rounded-2xl border-0 bg-gray-50 px-4 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700"
                    />
                </div>
            </div>

            {/* --- 4. Budget & Hiring --- */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 dark:bg-zinc-800/50 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calculator size={16} className="text-brand-orange" /> 
                        Payment & Hiring
                    </h3>
                </div>
                
                <div className="p-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="budget" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Budget Per Person
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="text-gray-500 font-bold">₹</span>
                            </div>
                            <input
                                type="number"
                                name="budget"
                                id="budget"
                                required
                                min="1"
                                placeholder="500"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="block w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Num. of People
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Users size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                required
                                min="1"
                                max="10"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="block w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                            />
                        </div>
                    </div>
                </div>

                {totalCost > 0 && (
                    <div className="bg-blue-50/50 px-5 py-4 flex justify-between items-center dark:bg-blue-900/10">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Total Estimated Cost</span>
                        <span className="text-xl font-bold text-brand-blue">₹{totalCost.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Posting...
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={20} />
                        Post Job
                    </>
                )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}