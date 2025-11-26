"use client";

import { useState, useActionState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { addZone, deleteZone } from "./actions";
import { ArrowLeft, Trash2, MapPin, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Lazy load map
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading Map...
    </div>
  )
});

type Zone = {
  id: string;
  radius_meters: number;
  created_at: string;
};

const initialState = {
  error: "",
  success: false
};

export default function ServiceZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState(1000); // Default 1km
  
  const [state, action, isPending] = useActionState(addZone, initialState);
  const supabase = createClient();
  const router = useRouter();

  // 1. Fetch Zones
  useEffect(() => {
    const fetchZones = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data } = await supabase
        .from("provider_locations")
        .select("id, radius_meters, created_at")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setZones(data);
      setLoading(false);
    };

    fetchZones();
  }, [router, supabase]);

  // 2. Handle Success (Close form)
  useEffect(() => {
    if (state?.success) {
      setShowAddForm(false);
      setLocation(null);
      setRadius(1000); // Reset radius to 1km default
      // Refresh list strictly via client fetch or router refresh
      router.refresh();
      // Re-fetch manually to ensure UI sync without full reload
      supabase.from("provider_locations").select("id, radius_meters, created_at").order("created_at", { ascending: false })
        .then(({ data }) => { if(data) setZones(data); });
    }
  }, [state?.success, router, supabase]);

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this zone?")) return;
    await deleteZone(id);
    setZones(zones.filter(z => z.id !== id));
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 p-6 pb-24 dark:bg-black">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/profile"
          className="rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-2xl font-bold text-brand-blue">Service Zones</h1>
      </div>

      {/* List of Zones */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>
        ) : zones.length === 0 && !showAddForm ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <MapPin className="mx-auto h-12 w-12 mb-3 text-gray-300 dark:text-zinc-700" />
            <p>No service zones set.</p>
            <p className="text-xs mt-1">Add locations where you are willing to work.</p>
          </div>
        ) : (
          zones.map((zone, index) => (
            <div key={zone.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue dark:bg-blue-900/20 dark:text-blue-400">
                  <span className="font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Zone #{index + 1}</p>
                  <p className="text-xs text-gray-500">{(zone.radius_meters / 1000).toFixed(1)} km radius</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(zone.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Zone Button or Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-all dark:border-zinc-700 dark:hover:border-blue-500"
        >
          <Plus size={20} />
          <span>Add New Zone</span>
        </button>
      ) : (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Service Zone</h3>
          
          <form action={action} className="space-y-4">
            {state?.error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded dark:bg-red-900/20 dark:text-red-400">
                    {state.error}
                </div>
            )}

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Center Point</label>
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

            <div>
                <div className="flex justify-between text-sm mb-2">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Radius</label>
                    <span className="text-brand-blue font-semibold">{(radius / 1000).toFixed(1)} km</span>
                </div>
                <input 
                    type="range"
                    name="radius"
                    min="1000"
                    max="20000"
                    step="500"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue dark:bg-zinc-800"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending || !location}
                    className="flex-1 rounded-lg bg-brand-blue py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending && <Loader2 size={16} className="animate-spin" />}
                    Save Zone
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}