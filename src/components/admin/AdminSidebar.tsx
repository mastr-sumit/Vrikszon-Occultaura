"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  GraduationCap,
  CalendarCheck,
  ShoppingBag,
  Mail,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab = "overview" | "products" | "courses" | "bookings" | "orders" | "messages";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    products: number;
    courses: number;
    bookings: number;
    orders: number;
    messages: number;
  };
  adminUser: {
    name: string;
    email: string;
  };
}

export function AdminSidebar({
  currentTab,
  onTabChange,
  counts,
  adminUser,
}: AdminSidebarProps) {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package, badge: counts.products },
    { id: "courses", label: "Courses", icon: GraduationCap, badge: counts.courses },
    { id: "bookings", label: "Bookings", icon: CalendarCheck, badge: counts.bookings },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: counts.orders },
    { id: "messages", label: "Inquiries", icon: Mail, badge: counts.messages },
  ];

  return (
    <aside className="w-64 shrink-0 bg-navy-900 border-r border-navy-800 flex flex-col justify-between min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-navy-800 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-body font-semibold text-white tracking-wide">
              Vrikszon Admin
            </h1>
            <p className="text-caption text-navy-300">Management Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-base text-small font-medium transition-all duration-fast cursor-pointer",
                  isActive
                    ? "bg-gold-500 text-navy-950 shadow-md font-semibold"
                    : "text-navy-200 hover:text-white hover:bg-navy-800/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-navy-950" : "text-gold-400")} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-mono font-medium",
                      isActive
                        ? "bg-navy-950 text-gold-400"
                        : "bg-navy-950/80 text-navy-300 border border-navy-800"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-navy-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-base bg-navy-950/60 border border-navy-800 text-xs text-navy-300 hover:text-gold-400 hover:border-gold-400/30 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] text-navy-500 font-mono">Live</span>
        </Link>

        <div className="flex items-center gap-3 px-3.5 py-2 rounded-base bg-navy-950/40 border border-navy-800/60">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-400/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">{adminUser.name}</p>
            <p className="text-[10px] text-navy-400 truncate">{adminUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
