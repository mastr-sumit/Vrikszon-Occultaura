"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  CalendarCheck,
  ShoppingBag,
  Mail,
  CheckCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { AdminBooking } from "./tabs/BookingsTab";
import { AdminOrder } from "./tabs/OrdersTab";
import { AdminMessage } from "./tabs/MessagesTab";

export interface NotificationItem {
  id: string;
  type: "booking" | "order" | "message";
  title: string;
  subtitle: string;
  time: string | Date;
  isUnread: boolean;
  tab: AdminTab;
}

interface NotificationDropdownProps {
  bookings: AdminBooking[];
  orders: AdminOrder[];
  messages: AdminMessage[];
  onNavigateTab: (tab: AdminTab) => void;
}

export function NotificationDropdown({
  bookings,
  orders,
  messages,
  onNavigateTab,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "booking" | "order" | "message">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Aggregate and sort notifications
  const allNotifications: NotificationItem[] = [
    ...bookings.map((b) => ({
      id: `booking-${b.id}`,
      type: "booking" as const,
      title: `Booking: ${b.name}`,
      subtitle: `${b.service} (${b.phone})`,
      time: b.createdAt,
      isUnread: b.status === "PENDING",
      tab: "bookings" as AdminTab,
    })),
    ...messages.map((m) => ({
      id: `message-${m.id}`,
      type: "message" as const,
      title: `Inquiry: ${m.name}`,
      subtitle: `${m.reason} — ${m.message.slice(0, 45)}...`,
      time: m.createdAt,
      isUnread: !m.isRead,
      tab: "messages" as AdminTab,
    })),
    ...orders.map((o) => ({
      id: `order-${o.id}`,
      type: "order" as const,
      title: `Order ${o.orderNumber} (₹${o.totalPrice.toLocaleString("en-IN")})`,
      subtitle: `${o.fullName} · ${o.status}`,
      time: o.createdAt,
      isUnread: o.status === "PENDING" || o.paymentStatus === "UNPAID",
      tab: "orders" as AdminTab,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const unreadCount = allNotifications.filter((n) => n.isUnread).length;

  const filteredNotifications = allNotifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="h-4 w-4 text-emerald-400" />;
      case "order":
        return <ShoppingBag className="h-4 w-4 text-sky-400" />;
      case "message":
        return <Mail className="h-4 w-4 text-amber-400" />;
    }
  };

  const getBadgeColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "booking":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "order":
        return "bg-sky-500/10 border-sky-500/20 text-sky-400";
      case "message":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-base border border-navy-700 bg-navy-950/80 text-navy-200 hover:text-white hover:border-gold-400/40 transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4 text-gold-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 font-mono text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-navy-700/80 bg-navy-900 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-body font-semibold text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-[10px] font-bold text-gold-400">
                  {unreadCount} New
                </span>
              )}
            </div>

            <span className="text-[11px] text-navy-400">
              Total {allNotifications.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-navy-800/80 bg-navy-950/40 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-gold-500 text-navy-950 font-bold"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              All ({allNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("booking")}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === "booking"
                  ? "bg-emerald-500 text-navy-950 font-bold"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("order")}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === "order"
                  ? "bg-sky-500 text-navy-950 font-bold"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("message")}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === "message"
                  ? "bg-amber-500 text-navy-950 font-bold"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              Messages ({messages.length})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-navy-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-navy-400 text-xs">
                <Bell className="mx-auto h-8 w-8 text-navy-600 mb-2 opacity-50" />
                No notifications in this category yet.
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    setIsOpen(false);
                  }}
                  className={`group p-3.5 flex items-start gap-3 hover:bg-navy-800/70 transition-colors cursor-pointer ${
                    item.isUnread ? "bg-navy-800/30" : ""
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getBadgeColor(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-medium text-white truncate">
                        {item.title}
                      </p>
                      {item.isUnread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-gold-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-navy-300 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                    <p className="text-[10px] text-navy-500 mt-1 font-mono">
                      {new Date(item.time).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-navy-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-navy-800 bg-navy-950/80 text-center">
            <span className="text-[11px] text-gold-400 font-medium">
              Click any notification to open its details
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
