"use client";

import { useState, useMemo } from "react";
import {
  CalendarCheck,
  Mail,
  Phone,
  Calendar,
  Search,
  Archive,
  ArchiveRestore,
  Trash2,
  Filter,
} from "lucide-react";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

export interface AdminBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  amount?: number | null;
  paymentStatus?: "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
  razorpayOrderId?: string | null;
  preferredDate: string | Date | null;
  message: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  archived: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface BookingsTabProps {
  bookings: AdminBooking[];
  onBookingsUpdated: (bookings: AdminBooking[]) => void;
}

export function BookingsTab({
  bookings,
  onBookingsUpdated,
}: BookingsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete modal state
  const [deleteBooking, setDeleteBooking] = useState<AdminBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts
  const archivedCount = useMemo(
    () => bookings.filter((b) => b.archived).length,
    [bookings]
  );
  const activeCount = useMemo(
    () => bookings.filter((b) => !b.archived).length,
    [bookings]
  );

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Archive visibility
      if (showArchived) {
        if (!b.archived) return false;
      } else {
        if (b.archived) return false;
      }

      // Status filter
      if (filterStatus !== "ALL" && b.status !== filterStatus) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesEmail = b.email.toLowerCase().includes(query);
        const matchesPhone = b.phone.toLowerCase().includes(query);
        const matchesService = b.service.toLowerCase().includes(query);
        const matchesMessage = b.message?.toLowerCase().includes(query) || false;
        return matchesName || matchesEmail || matchesPhone || matchesService || matchesMessage;
      }

      return true;
    });
  }, [bookings, showArchived, filterStatus, searchTerm]);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: AdminBooking["status"]) => {
    setUpdatingId(id);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        onBookingsUpdated(bookings.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      }
    } catch (err) {
      console.error("Update booking status error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle archive toggle
  const handleToggleArchive = async (booking: AdminBooking) => {
    setUpdatingId(booking.id);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, archived: !booking.archived }),
      });

      if (res.ok) {
        const updated = await res.json();
        onBookingsUpdated(bookings.map((b) => (b.id === booking.id ? { ...b, ...updated } : b)));
      }
    } catch (err) {
      console.error("Toggle archive booking error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!deleteBooking) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/bookings?id=${deleteBooking.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
        setIsDeleting(false);
        return;
      }

      onBookingsUpdated(bookings.filter((b) => b.id !== deleteBooking.id));
      setDeleteBooking(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: AdminBooking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-950/60 border-emerald-500/30 text-emerald-400";
      case "COMPLETED":
        return "bg-sky-950/60 border-sky-500/30 text-sky-400";
      case "CANCELLED":
        return "bg-rose-950/60 border-rose-500/30 text-rose-400";
      default:
        return "bg-amber-950/60 border-amber-500/30 text-amber-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Client Consultations
          </h3>
          <p className="text-xs text-navy-300 mt-0.5">
            {activeCount} active requests · {archivedCount} archived
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

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, service or notes..."
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-44">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Booking Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-12 text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-navy-400 mb-3" />
          <h4 className="font-heading text-body font-medium text-white">
            {showArchived ? "No Archived Bookings" : "No Bookings Found"}
          </h4>
          <p className="text-xs text-navy-300 mt-1 max-w-sm mx-auto">
            {searchTerm || filterStatus !== "ALL"
              ? "No booking matches your active search or filter criteria."
              : showArchived
              ? "You have not archived any consultation requests yet."
              : "New consultation bookings submitted by clients through the website will appear here in real-time."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`rounded-xl border p-5 shadow-md flex flex-col justify-between transition-colors ${
                booking.archived
                  ? "border-navy-800/80 bg-navy-950/60 opacity-80"
                  : "border-navy-800 bg-navy-900/80 hover:border-navy-700"
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-small font-semibold text-white">
                        {booking.name}
                      </h4>
                      {booking.archived && (
                        <span className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-[9px] font-medium text-navy-300 uppercase">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gold-400 font-medium mt-0.5">
                      {booking.service}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    {booking.paymentStatus && (
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold tracking-wide ${
                          booking.paymentStatus === "PAID"
                            ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                            : "border-amber-500/30 bg-amber-950/40 text-amber-300"
                        }`}
                      >
                        {booking.paymentStatus} {booking.amount ? `(₹${booking.amount})` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-navy-200 pt-2 border-t border-navy-800/60">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                    <a
                      href={`mailto:${booking.email}`}
                      className="hover:text-gold-400 truncate"
                    >
                      {booking.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                    <a href={`tel:${booking.phone}`} className="hover:text-gold-400">
                      {booking.phone}
                    </a>
                  </div>
                  {booking.preferredDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                      <span>{new Date(booking.preferredDate).toLocaleDateString("en-IN")}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-navy-400 pt-1">
                    Booked: {new Date(booking.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="p-2.5 rounded-base bg-navy-950/60 border border-navy-800/60 text-xs text-navy-300 italic whitespace-pre-wrap leading-relaxed">
                    &quot;{booking.message}&quot;
                  </div>
                )}
              </div>

              {/* Card Footer: Status Update + Archive & Delete Actions */}
              <div className="mt-4 pt-3 border-t border-navy-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-navy-400">Status:</span>
                  <select
                    value={booking.status}
                    disabled={updatingId === booking.id}
                    onChange={(e) =>
                      handleStatusChange(
                        booking.id,
                        e.target.value as AdminBooking["status"]
                      )
                    }
                    className="rounded-base border border-navy-700 bg-navy-950 px-2 py-1 text-xs text-white focus:border-gold-400 focus:outline-none disabled:opacity-50"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  {/* Archive / Unarchive Button */}
                  <button
                    type="button"
                    title={booking.archived ? "Unarchive Booking" : "Archive Booking"}
                    disabled={updatingId === booking.id}
                    onClick={() => handleToggleArchive(booking)}
                    className="p-1.5 rounded-base border border-navy-700 bg-navy-950 text-navy-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {booking.archived ? (
                      <ArchiveRestore className="h-3.5 w-3.5 text-gold-400" />
                    ) : (
                      <Archive className="h-3.5 w-3.5 text-navy-400" />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    title="Delete Permanently"
                    onClick={() => setDeleteBooking(booking)}
                    className="p-1.5 rounded-base border border-navy-700 bg-navy-950 text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteBooking}
        title="Delete Consultation Booking"
        message={
          deleteBooking
            ? `Are you sure you want to permanently delete the consultation booking for "${deleteBooking.name}" (${deleteBooking.service})? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteBooking(null)}
      />
    </div>
  );
}

