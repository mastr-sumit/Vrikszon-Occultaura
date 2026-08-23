"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";

export interface AdminBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string | Date | null;
  message: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
        onBookingsUpdated(bookings.map((b) => (b.id === id ? updated : b)));
      }
    } catch (err) {
      console.error("Update booking status error:", err);
    } finally {
      setUpdatingId(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Client Consultations
          </h3>
          <p className="text-xs text-navy-300">
            {bookings.length} consultation requests received from /book-consultation
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-12 text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-navy-400 mb-3" />
          <h4 className="font-heading text-body font-medium text-white">
            No Bookings Recorded Yet
          </h4>
          <p className="text-xs text-navy-300 mt-1 max-w-sm mx-auto">
            New consultation bookings submitted by clients through the website will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-navy-800 bg-navy-900/80 p-5 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading text-small font-semibold text-white">
                      {booking.name}
                    </h4>
                    <p className="text-[11px] text-gold-400 font-medium mt-0.5">
                      {booking.service}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
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
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="p-2.5 rounded-base bg-navy-950/60 border border-navy-800/60 text-xs text-navy-300 italic">
                    &quot;{booking.message}&quot;
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-navy-400">Update Status:</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
