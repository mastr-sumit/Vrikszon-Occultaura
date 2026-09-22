"use client";

import { useState, useMemo } from "react";
import {
  Mail,
  Phone,
  Search,
  Archive,
  ArchiveRestore,
  Trash2,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  reason: string;
  message: string;
  isRead: boolean;
  archived: boolean;
  createdAt: string | Date;
}

interface MessagesTabProps {
  messages: AdminMessage[];
  onMessagesUpdated: (messages: AdminMessage[]) => void;
}

export function MessagesTab({ messages, onMessagesUpdated }: MessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState("ALL");
  const [filterRead, setFilterRead] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete modal state
  const [deleteMessage, setDeleteMessage] = useState<AdminMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts
  const archivedCount = useMemo(
    () => messages.filter((m) => m.archived).length,
    [messages]
  );
  const activeCount = useMemo(
    () => messages.filter((m) => !m.archived).length,
    [messages]
  );

  // Unique reasons
  const reasons = useMemo(() => {
    const rSet = new Set<string>();
    messages.forEach((m) => rSet.add(m.reason));
    return Array.from(rSet);
  }, [messages]);

  // Filtered list
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Archive visibility
      if (showArchived) {
        if (!m.archived) return false;
      } else {
        if (m.archived) return false;
      }

      // Read status filter
      if (filterRead === "UNREAD" && m.isRead) return false;
      if (filterRead === "READ" && !m.isRead) return false;

      // Reason category filter
      if (filterReason !== "ALL" && m.reason !== filterReason) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesEmail = m.email.toLowerCase().includes(query);
        const matchesPhone = m.phone?.toLowerCase().includes(query) || false;
        const matchesReason = m.reason.toLowerCase().includes(query);
        const matchesMsg = m.message.toLowerCase().includes(query);
        return matchesName || matchesEmail || matchesPhone || matchesReason || matchesMsg;
      }

      return true;
    });
  }, [messages, showArchived, filterRead, filterReason, searchTerm]);

  // Toggle Read / Unread
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
        onMessagesUpdated(messages.map((m) => (m.id === id ? { ...m, ...updated } : m)));
      }
    } catch (err) {
      console.error("Toggle read error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle Archive
  const handleToggleArchive = async (msg: AdminMessage) => {
    setUpdatingId(msg.id);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, archived: !msg.archived }),
      });

      if (res.ok) {
        const updated = await res.json();
        onMessagesUpdated(messages.map((m) => (m.id === msg.id ? { ...m, ...updated } : m)));
      }
    } catch (err) {
      console.error("Toggle archive error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteMessage) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/messages?id=${deleteMessage.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
        setIsDeleting(false);
        return;
      }

      onMessagesUpdated(messages.filter((m) => m.id !== deleteMessage.id));
      setDeleteMessage(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Customer Inquiries
          </h3>
          <p className="text-xs text-navy-300 mt-0.5">
            {activeCount} active inquiries · {archivedCount} archived
          </p>
        </div>

        {/* Show Archived Toggle */}
        <button
          type="button"
          onClick={() => setShowArchived((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-base border text-xs font-medium transition-colors cursor-pointer ${
            showArchived
              ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
              : "border-navy-700 bg-navy-900 text-navy-300 hover:text-white hover:border-navy-600"
          }`}
        >
          {showArchived ? (
            <>
              <ArchiveRestore className="h-3.5 w-3.5 text-gold-400" />
              <span>Showing Archived ({archivedCount})</span>
            </>
          ) : (
            <>
              <Archive className="h-3.5 w-3.5 text-navy-400" />
              <span>Show Archived ({archivedCount})</span>
            </>
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by name, email, phone or message text..."
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-36">
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as "ALL" | "UNREAD" | "READ")}
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
          >
            <option value="ALL">All Read States</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>
        </div>

        {reasons.length > 0 && (
          <div className="w-full sm:w-44">
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-navy-400 mb-3" />
          <h4 className="font-heading text-body font-medium text-white">
            {showArchived ? "No Archived Inquiries" : "No Inquiries Found"}
          </h4>
          <p className="text-xs text-navy-300 mt-1 max-w-sm mx-auto">
            {searchTerm || filterReason !== "ALL" || filterRead !== "ALL"
              ? "No message matches your active search or filter criteria."
              : showArchived
              ? "You have not archived any customer inquiries yet."
              : "Messages sent via the Contact page will be logged here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-colors ${
                msg.archived
                  ? "border-navy-800/80 bg-navy-950/60 opacity-80"
                  : msg.isRead
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
                    {msg.archived && (
                      <span className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-[9px] font-medium text-navy-300 uppercase">
                        Archived
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

                <div className="flex items-center gap-1.5">
                  {/* Mark Read/Unread */}
                  <button
                    type="button"
                    disabled={updatingId === msg.id}
                    onClick={() => toggleRead(msg.id, msg.isRead)}
                    className="px-2.5 py-1.5 rounded-base border border-navy-700 bg-navy-950 text-xs font-medium text-navy-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {msg.isRead ? "Mark Unread" : "Mark as Read"}
                  </button>

                  {/* Archive / Unarchive Button */}
                  <button
                    type="button"
                    title={msg.archived ? "Unarchive Inquiry" : "Archive Inquiry"}
                    disabled={updatingId === msg.id}
                    onClick={() => handleToggleArchive(msg)}
                    className="p-1.5 rounded-base border border-navy-700 bg-navy-950 text-navy-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {msg.archived ? (
                      <ArchiveRestore className="h-3.5 w-3.5 text-gold-400" />
                    ) : (
                      <Archive className="h-3.5 w-3.5 text-navy-400" />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    title="Delete Permanently"
                    onClick={() => setDeleteMessage(msg)}
                    className="p-1.5 rounded-base border border-navy-700 bg-navy-950 text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 p-3 rounded-base bg-navy-950/60 border border-navy-800/80 text-xs text-navy-200 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteMessage}
        title="Delete Customer Inquiry"
        message={
          deleteMessage
            ? `Are you sure you want to permanently delete the inquiry from "${deleteMessage.name}" (${deleteMessage.email})? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteMessage(null)}
      />
    </div>
  );
}

