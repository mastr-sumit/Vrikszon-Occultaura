"use client";

import { signOut } from "next-auth/react";
import { LogOut, RefreshCw, Sparkles } from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { NotificationDropdown } from "./NotificationDropdown";
import { AdminBooking } from "./tabs/BookingsTab";
import { AdminOrder } from "./tabs/OrdersTab";
import { AdminMessage } from "./tabs/MessagesTab";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  currentTab: AdminTab;
  isRefreshing: boolean;
  onRefresh: () => void;
  bookings: AdminBooking[];
  orders: AdminOrder[];
  messages: AdminMessage[];
  onNavigateTab: (tab: AdminTab) => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: "System Overview",
    subtitle: "Real-time snapshot of Vrikszon Occultaura catalogue, bookings, and store data.",
  },
  products: {
    title: "Products Catalogue",
    subtitle: "Manage spiritual gemstone bracelets, rudraksha malas, pyramids, and sacred items.",
  },
  courses: {
    title: "Academy & Courses",
    subtitle: "Manage professional certification courses in Numerology, Vastu, and Occult Sciences.",
  },
  bookings: {
    title: "Consultation Bookings",
    subtitle: "Review and manage personalized numerology and vastu consultation requests.",
  },
  orders: {
    title: "Shop Orders",
    subtitle: "Track customer orders, shipping status, and payment processing.",
  },
  messages: {
    title: "Customer Inquiries",
    subtitle: "Direct contact form inquiries and consultation questions from the website.",
  },
};

export function AdminHeader({
  currentTab,
  isRefreshing,
  onRefresh,
  bookings,
  orders,
  messages,
  onNavigateTab,
}: AdminHeaderProps) {
  const { title, subtitle } = TAB_TITLES[currentTab];

  return (
    <header className="px-8 py-5 bg-navy-900/60 border-b border-navy-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading text-h4 font-semibold text-white">
            {title}
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/20 text-[11px] font-medium text-gold-400">
            <Sparkles className="h-3 w-3" />
            <span>Database Live</span>
          </span>
        </div>
        <p className="text-xs text-navy-300 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Mode Switcher (Dark / Light) */}
        <ThemeToggle variant="admin" showLabel={true} />

        {/* Real-time Notification Center */}
        <NotificationDropdown
          bookings={bookings}
          orders={orders}
          messages={messages}
          onNavigateTab={onNavigateTab}
        />

        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-base border border-navy-700 bg-navy-950/80 text-xs font-medium text-navy-200 hover:text-white hover:border-gold-400/30 transition-colors disabled:opacity-50 cursor-pointer"
          title="Reload latest data from database"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-gold-400 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-3.5 py-2 rounded-base border border-rose-500/30 bg-rose-950/20 text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
