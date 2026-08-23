"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Search, X, Sparkles, Filter } from "lucide-react";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES, type Service } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "Numerology", label: "Numerology & Lo Shu" },
  { id: "Name & Business", label: "Name & Business" },
  { id: "KP Astrology", label: "KP Astrology" },
  { id: "Remedies & Healing", label: "Remedies & Yantras" },
];

/**
 * ServicesGrid — Enhanced with 21st.dev Category Filter Tabs & Live Search
 *
 * Provides frictionless instant discovery across all 21 services with
 * animated filter pills, live search bar, dynamic results counter, and empty states.
 */
const ServicesGrid = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeServices = useMemo(() => {
    return SERVICES.filter((service) => service.enabled);
  }, []);

  const filteredServices = useMemo(() => {
    return activeServices.filter((service) => {
      // Category filter matching
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "Numerology" &&
          (service.category === "Numerology" || service.name.toLowerCase().includes("numerology") || service.name.toLowerCase().includes("grid") || service.name.toLowerCase().includes("number"))) ||
        (selectedCategory === "Name & Business" &&
          (service.category === "Business & Name" || service.name.toLowerCase().includes("business") || service.name.toLowerCase().includes("name") || service.name.toLowerCase().includes("pronology"))) ||
        (selectedCategory === "KP Astrology" &&
          (service.category === "Astrology" || service.name.toLowerCase().includes("astrology") || service.name.toLowerCase().includes("dasha") || service.name.toLowerCase().includes("kp"))) ||
        (selectedCategory === "Remedies & Healing" &&
          (service.category === "Remedies & Healing" || service.name.toLowerCase().includes("remedies") || service.name.toLowerCase().includes("healing") || service.name.toLowerCase().includes("yantra") || service.name.toLowerCase().includes("crystal") || service.name.toLowerCase().includes("rituals")));

      // Search query matching
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeServices, selectedCategory, searchQuery]);

  return (
    <section
      id="services-catalog"
      aria-label="All Services & Consultation Catalog"
      className="bg-warm-white py-16 md:py-24 lg:py-28"
    >
      <Container size="wide">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-600">
              Interactive Catalog
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-navy-950 tracking-tight">
            Comprehensive <span className="text-gold-600 italic">Services & Remedies</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Every offering is individually tailored, combining classical Numerology, Vastu principles,
            KP Astrology, and sacred remedies for your complete well-being.
          </p>
        </div>

        {/* ── Search Bar & Category Filter Tabs ── */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Top Search Input */}
          <div className="relative max-w-xl mx-auto w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gold-600">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name, remedy, or focus area (e.g. Marriage, Wealth, Loshu)..."
              className="w-full rounded-full border border-navy-900/15 bg-white py-3.5 pl-11 pr-10 text-sm text-navy-900 shadow-sm placeholder:text-navy-900/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-navy-900"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  type="button"
                  className={cn(
                    "relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "bg-gold-500 text-navy-950 shadow-md font-bold"
                      : "bg-white text-navy-800/80 hover:bg-gold-50 hover:text-navy-950 border border-navy-900/10"
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Results Count & Active Filter Indicator */}
          <div className="flex items-center justify-between text-xs text-text-secondary px-2 max-w-6xl mx-auto w-full">
            <span>
              Showing <strong>{filteredServices.length}</strong> of {activeServices.length} offerings
            </span>
            {(selectedCategory !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-gold-700 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* ── Services Cards Grid ── */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="h-full flex">
                <ServiceCard service={service} variant="grid" className="w-full" />
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-navy-900/10 bg-white p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-medium text-navy-950 mb-2">
              No matching consultations found
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mb-6">
              We couldn&apos;t find any service matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or browse all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold text-navy-950 hover:bg-gold-400 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              View All 21 Services
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ServicesGrid;
