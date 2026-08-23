"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, CheckCircle2, MessageSquare } from "lucide-react";

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  reason: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface MessagesTabProps {
  messages: AdminMessage[];
  onMessagesUpdated: (messages: AdminMessage[]) => void;
}

export function MessagesTab({ messages, onMessagesUpdated }: MessagesTabProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleRead = async (id: string, currentRead: boolean) => {
    setUpdatingId(id);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentRead }),
      });

      if (res.ok) {
        const updated = await res.json();
        onMessagesUpdated(messages.map((m) => (m.id === id ? updated : m)));
      }
    } catch (err) {
      console.error("Toggle read error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Customer Inquiries
          </h3>
          <p className="text-xs text-navy-300">
            {messages.length} inquiries received from the /contact form
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-navy-400 mb-3" />
          <h4 className="font-heading text-body font-medium text-white">
            No Inquiries Recorded Yet
          </h4>
          <p className="text-xs text-navy-300 mt-1 max-w-sm mx-auto">
            Messages sent via the Contact page will be logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-colors ${
                msg.isRead
                  ? "border-navy-800 bg-navy-900/60"
                  : "border-gold-500/40 bg-navy-900 shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-small font-semibold text-white">
                      {msg.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/20 text-[10px] font-medium text-gold-400">
                      {msg.reason}
                    </span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-navy-300 mt-1">
                    <a href={`mailto:${msg.email}`} className="hover:text-gold-400">
                      {msg.email}
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="hover:text-gold-400">
                        {msg.phone}
                      </a>
                    )}
                    <span>· {new Date(msg.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={updatingId === msg.id}
                  onClick={() => toggleRead(msg.id, msg.isRead)}
                  className="px-3 py-1.5 rounded-base border border-navy-700 bg-navy-950 text-xs font-medium text-navy-200 hover:text-white transition-colors cursor-pointer"
                >
                  {msg.isRead ? "Mark Unread" : "Mark as Read"}
                </button>
              </div>

              <div className="mt-3.5 p-3 rounded-base bg-navy-950/60 border border-navy-800/80 text-xs text-navy-200 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
