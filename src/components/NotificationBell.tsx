"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  resource_url: string | null;
  type: string;
};

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();
  const router = useRouter();

  // 1. Fetch Initial Data & Subscribe to Realtime
  useEffect(() => {
    const fetchData = async () => {
      // Get unread count
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      
      setUnreadCount(count || 0);

      // Get recent notifications
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) setNotifications(data);
    };

    fetchData();

    // Realtime Subscription
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Update UI instantly on new notification
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // 2. Handle Click Outside (to close dropdown)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Mark as Read Handler
  const handleMarkAsRead = async (id: string, url: string | null) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setIsOpen(false);

    // Background DB update
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    // Navigate
    if (url) router.push(url);
  };

  const handleMarkAllRead = async () => {
     setNotifications((prev) => prev.map(n => ({ ...n, is_read: true })));
     setUnreadCount(0);
     await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-brand-blue transition-all dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0f172a]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-[#0f172a] sm:w-96 z-50">
          
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-blue hover:text-blue-600 transition-colors">
                    Mark all read
                </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.resource_url)}
                  className={`relative cursor-pointer px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !notif.is_read ? "bg-blue-50/50 dark:bg-blue-500/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Status Indicator */}
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!notif.is_read ? "bg-brand-blue" : "bg-transparent"}`} />
                    
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm ${!notif.is_read ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                        {notif.body}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-slate-100 bg-slate-50/50 p-2 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <Link 
              href="/profile/settings" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}