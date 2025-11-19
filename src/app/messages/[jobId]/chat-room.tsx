"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "./actions";
import { Send, Loader2 } from "lucide-react";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ChatRoom({ 
  jobId, 
  userId, 
  initialMessages 
}: { 
  jobId: string; 
  userId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 1. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 2. Realtime Subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, supabase]);

  // 3. Send Handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    // Optimistic UI update could go here, but realtime is fast enough usually
    
    const result = await sendMessage(jobId, input);
    if (result?.error) {
        alert(result.error);
    } else {
        setInput("");
    }
    setSending(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe
                    ? "bg-brand-blue text-white rounded-br-none"
                    : "bg-white text-gray-800 dark:bg-zinc-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-zinc-700"
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
             <p className="text-center text-xs text-gray-400 mt-10">Start the conversation...</p>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-3 border-t border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:bg-zinc-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}