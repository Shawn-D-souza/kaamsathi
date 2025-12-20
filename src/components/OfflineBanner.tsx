"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Network } from "@capacitor/network";
import { Toast } from "@capacitor/toast";
import { WifiOff, Loader2, RefreshCw } from "lucide-react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isRecovering, startTransition] = useTransition();
  const wasOffline = useRef(false);
  const router = useRouter();

  useEffect(() => {
    Network.getStatus().then((status) => {
      setIsOnline(status.connected);
      if (!status.connected) wasOffline.current = true;
    });

    const listener = Network.addListener("networkStatusChange", (status) => {
      const currentlyOnline = status.connected;
      setIsOnline(currentlyOnline);

      if (!currentlyOnline) {
        wasOffline.current = true;
      } else if (currentlyOnline && wasOffline.current) {
        startTransition(() => {
          router.refresh();
        });
      }
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [router]);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        window.location.reload();
      } else {
        await Toast.show({
          text: "Still offline. Please check your connection.",
          duration: "short",
          position: "bottom",
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (isOnline && !isRecovering) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div
        className={`flex items-center justify-between px-8 py-8 shadow-2xl transition-colors duration-500 ${
          isOnline ? "bg-emerald-600" : "bg-slate-900"
        }`}
      >
        <div className="flex items-center gap-4">
          {isOnline ? (
            <>
              <div className="rounded-full bg-white/20 p-3">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Back Online</span>
                <span className="text-sm text-white/90">Syncing data...</span>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-red-500/20 p-3 text-red-500">
                <WifiOff size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  No Internet Connection
                </span>
                <span className="text-sm text-slate-400">
                  Waiting for connection...
                </span>
              </div>
            </>
          )}
        </div>

        {!isOnline && (
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
          >
            {isChecking ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            <span>Retry</span>
          </button>
        )}
      </div>

      {!isOnline && (
        <div className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm transition-all duration-500" />
      )}
    </div>
  );
}