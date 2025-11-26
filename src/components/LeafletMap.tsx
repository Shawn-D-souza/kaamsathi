"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Loader2, X, Locate, AlertCircle, Settings } from "lucide-react";
import "leaflet/dist/leaflet.css";

// --- Icon Fix for Next.js ---
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// --- Types ---
type Location = {
  lat: number;
  lng: number;
};

interface Suggestion {
  label: string;
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  location?: Location | null;
  radius?: number; // meters
  onLocationSelect?: (lat: number | null, lng: number | null) => void;
  interactive?: boolean;
}

// --- Internal Component: Handle Long Press / Right Click logic ---
function MapInteractionHandler({ 
  onLocationSelect, 
  interactive,
  currentLocation 
}: { 
  onLocationSelect?: (lat: number | null, lng: number | null) => void, 
  interactive: boolean,
  currentLocation: Location | null
}) {
  useMapEvents({
    contextmenu(e) {
      if (!interactive || !onLocationSelect) return;

      if (currentLocation) {
        const currentLatLng = L.latLng(currentLocation.lat, currentLocation.lng);
        const distance = e.latlng.distanceTo(currentLatLng); 

        if (distance < 50) {
          onLocationSelect(null, null); 
          return;
        }
      }
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- Internal Helper: Fly to location ---
function MapController({ center }: { center: Location | null }) {
  const map = useMap();
  const lastCenter = useRef<string>("");

  useEffect(() => {
    if (center) {
      const centerKey = `${center.lat}-${center.lng}`;
      if (lastCenter.current !== centerKey) {
        map.flyTo([center.lat, center.lng], 16, {
          animate: true,
          duration: 1.5
        });
        lastCenter.current = centerKey;
      }
    }
  }, [center, map]);
  return null;
}

// --- Main Component ---
export default function LeafletMap({ 
  location, 
  radius, 
  onLocationSelect, 
  interactive = false 
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [mapCenter, setMapCenter] = useState<Location | null>(location || null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Search Logic
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5`
        );
        const data = await res.json();
        
        const formattedSuggestions: Suggestion[] = data.features.map((f: any) => ({
            label: `${f.properties.name || ''} ${f.properties.city || ''} ${f.properties.country || ''}`.trim(),
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0]
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setMapCenter({ lat: s.lat, lng: s.lng });
    if (onLocationSelect) onLocationSelect(s.lat, s.lng);
    setQuery(s.label.split(",")[0]);
    setShowSuggestions(false);
  };

  // 3. Handle GPS (Improved UX)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported");
        return;
    }

    setLocating(true);
    setErrorMsg(null);
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter({ lat: latitude, lng: longitude });
            if (onLocationSelect) onLocationSelect(latitude, longitude);
            setLocating(false);
        },
        (error) => {
            setLocating(false);
            console.log("GPS Error Code:", error.code); 

            let msg = "Unable to find you.";
            
            // Distinct Error Messages
            switch(error.code) {
                case 1: // PERMISSION_DENIED
                    msg = "Location permission denied. Please enable it in browser settings.";
                    break;
                case 2: // POSITION_UNAVAILABLE (Usually GPS off)
                    msg = "Location signal lost. Please ensure your Device GPS is turned on.";
                    break;
                case 3: // TIMEOUT
                    msg = "Location request timed out. Retry in a more open area.";
                    break;
            }
            showError(msg);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
  };

  // Helper to show snackbar
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000); // Visible for 5s
  };

  // 4. Handle Draggable Marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && onLocationSelect) {
          const { lat, lng } = marker.getLatLng();
          onLocationSelect(lat, lng);
        }
      },
    }),
    [onLocationSelect],
  );

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (!mounted) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading Map...
      </div>
    );
  }

  const initialCenter: [number, number] = location 
    ? [location.lat, location.lng] 
    : [20.5937, 78.9629]; 

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-zinc-800 dark:shadow-none z-0 group">
      
      {interactive && (
        <>
            {/* Search Bar */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-1">
                <div className="relative flex items-center rounded-lg bg-white shadow-md transition-all focus-within:ring-2 focus-within:ring-brand-blue/50 dark:bg-zinc-900 dark:shadow-lg dark:border dark:border-zinc-800">
                    <div className="pl-3 text-gray-400">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchInput}
                        placeholder="Search places..."
                        className="flex-1 bg-transparent py-3 pl-3 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
                    />
                    {query && (
                        <button onClick={clearSearch} className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelectSuggestion(s)}
                                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-b border-gray-50 last:border-none dark:border-zinc-800"
                            >
                                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                                <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                    {s.label}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Locate Me Button */}
            <button 
                onClick={handleLocateMe}
                disabled={locating}
                className="absolute bottom-8 right-4 z-[1000] h-12 w-12 flex items-center justify-center rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-50 active:scale-95 dark:bg-zinc-800 dark:text-gray-200 dark:border dark:border-zinc-700 transition-all"
                title="Use my location"
            >
                {locating ? <Loader2 size={20} className="animate-spin" /> : <Locate size={20} />}
            </button>

            {/* Error Snackbar (Google Toast Style) */}
            {errorMsg && (
                <div className="absolute bottom-24 left-4 right-4 z-[2000] flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-3 rounded-lg bg-zinc-800/95 px-4 py-3 text-sm text-white shadow-xl backdrop-blur-sm dark:bg-zinc-100/95 dark:text-zinc-900 max-w-sm">
                        <AlertCircle size={18} className="shrink-0 text-red-400 dark:text-red-600" />
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                </div>
            )}
        </>
      )}

      <MapContainer
        center={initialCenter}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false} 
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Attribution */}
        <div className="leaflet-bottom leaflet-right" style={{ pointerEvents: 'auto' }}>
             <div className="leaflet-control-attribution leaflet-control bg-white/70 px-1 text-[10px] text-gray-500 dark:bg-black/50 dark:text-gray-400">
                © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
             </div>
        </div>

        <MapController center={mapCenter} />

        <MapInteractionHandler 
            interactive={interactive} 
            onLocationSelect={onLocationSelect}
            currentLocation={location || null}
        />

        {location && (
             <Marker 
                position={[location.lat, location.lng]} 
                draggable={interactive}
                eventHandlers={interactive ? eventHandlers : undefined}
                ref={markerRef}
             />
        )}

        {location && radius && (
          <Circle 
            center={[location.lat, location.lng]}
            radius={radius}
            pathOptions={{ 
              color: 'var(--color-brand-blue)', 
              fillColor: 'var(--color-brand-blue)', 
              fillOpacity: 0.15,
              weight: 1.5
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}