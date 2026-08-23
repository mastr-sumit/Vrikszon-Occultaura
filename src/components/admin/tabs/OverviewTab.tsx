"use client";

import {
  Package,
  GraduationCap,
  CalendarCheck,
  ShoppingBag,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AdminTab } from "../AdminSidebar";
import { AdminProduct } from "../modals/ProductModal";
import { AdminCourse } from "../modals/CourseModal";

interface OverviewTabProps {
  products: AdminProduct[];
  courses: AdminCourse[];
  bookingsCount: number;
  ordersCount: number;
  messagesCount: number;
  onNavigateTab: (tab: AdminTab) => void;
  onAddProduct: () => void;
  onAddCourse: () => void;
}

export function OverviewTab({
  products,
  courses,
  bookingsCount,
  ordersCount,
  messagesCount,
  onNavigateTab,
  onAddProduct,
  onAddCourse,
}: OverviewTabProps) {
  const featuredProducts = products.filter((p) => p.featured).length;
  const activeProducts = products.filter((p) => p.enabled).length;
  const activeCourses = courses.filter((c) => c.enabled).length;

  const statCards = [
    {
      title: "Catalogue Products",
      value: products.length,
      subtitle: `${activeProducts} active · ${featuredProducts} featured`,
      icon: Package,
      tab: "products" as AdminTab,
      color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
    {
      title: "Academy Courses",
      value: courses.length,
      subtitle: `${activeCourses} active offerings`,
      icon: GraduationCap,
      tab: "courses" as AdminTab,
      color: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30",
    },
    {
      title: "Consultation Bookings",
      value: bookingsCount,
      subtitle: "Client consultations in DB",
      icon: CalendarCheck,
      tab: "bookings" as AdminTab,
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Store Orders",
      value: ordersCount,
      subtitle: "Customer orders placed",
      icon: ShoppingBag,
      tab: "orders" as AdminTab,
      color: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30",
    },
    {
      title: "Contact Inquiries",
      value: messagesCount,
      subtitle: "Messages from contact form",
      icon: Mail,
      tab: "messages" as AdminTab,
      color: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Vrikszon Occultaura · Admin Management Portal</span>
          </div>
          <h2 className="font-heading text-h3 font-semibold text-white tracking-tight">
            Welcome to the Catalogue & Operations Centre
          </h2>
          <p className="mt-2 text-small text-navy-200 leading-relaxed">
            Manage your sacred gemstone products, certification courses, client consultation bookings, and customer orders directly with real-time SQLite database synchronization.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onAddProduct}
              className="flex items-center gap-2 rounded-base bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-950 hover:bg-gold-400 transition-colors shadow-sm cursor-pointer"
            >
              <Package className="h-3.5 w-3.5" />
              <span>+ Add New Product</span>
            </button>
            <button
              type="button"
              onClick={onAddCourse}
              className="flex items-center gap-2 rounded-base border border-gold-400/40 bg-navy-950/80 px-4 py-2 text-xs font-semibold text-gold-400 hover:bg-navy-900 transition-colors cursor-pointer"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>+ Add New Course</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-4">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                onClick={() => onNavigateTab(stat.tab)}
                className="group relative rounded-xl border border-navy-800 bg-navy-900/80 p-5 shadow-md hover:border-gold-400/40 hover:bg-navy-900 transition-all duration-fast cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-navy-300">
                      {stat.title}
                    </span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 font-heading text-h3 font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-navy-800/80 text-[11px] text-navy-400">
                  <span className="truncate">{stat.subtitle}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-gold-400 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
