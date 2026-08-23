"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, Sparkles, GraduationCap, ShoppingBag, ArrowRight } from "lucide-react";
import { SERVICES, type Service } from "@/data/services";
import { COURSES, type Course } from "@/data/courses";
import { PRODUCTS, type Product, formatProductPrice } from "@/data/products";
import { cn } from "@/lib/utils";

interface SearchResultItem {
  id: string;
  type: "service" | "course" | "product";
  title: string;
  category: string;
  description: string;
  price?: number | null;
  href: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Unified dataset
  const allSearchableItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // Add Services
    SERVICES.filter((s) => s.enabled).forEach((service) => {
      items.push({
        id: `service-${service.id}`,
        type: "service",
        title: service.name,
        category: service.category,
        description: service.shortDescription,
        price: service.price,
        href: service.href || "/services",
      });
    });

    // Add Courses
    COURSES.filter((c) => c.enabled).forEach((course) => {
      items.push({
        id: `course-${course.id}`,
        type: "course",
        title: course.title,
        category: course.category || "Courses",
        description: course.shortDescription,
        price: course.price,
        href: `/courses#${course.slug}`,
      });
    });

    // Add Shop Products
    PRODUCTS.filter((p) => p.enabled).forEach((product) => {
      items.push({
        id: `product-${product.id}`,
        type: "product",
        title: product.name,
        category: product.category,
        description: product.shortDescription,
        price: product.price,
        href: "/shop",
      });
    });

    return items;
  }, []);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSearchableItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [allSearchableItems, query]);

  const handleSelectResult = (href: string) => {
    onClose();
    router.push(href);
  };

  const getBadgeStyle = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "service":
        return "bg-gold-500/20 text-gold-300 border-gold-500/30";
      case "course":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "product":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  const getTypeIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "service":
        return <Sparkles className="h-4 w-4 text-gold-400" />;
      case "course":
        return <GraduationCap className="h-4 w-4 text-indigo-400" />;
      case "product":
        return <ShoppingBag className="h-4 w-4 text-emerald-400" />;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-modal-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-hidden"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            key="search-modal-content"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold-500/30 bg-navy-900 shadow-2xl shadow-navy-950/80 z-10 flex flex-col max-h-[80vh]"
          >
            {/* Input Bar Header */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-3.5">
              <Search className="h-5 w-5 text-gold-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, courses, malas, crystals & remedies..."
                className="w-full bg-transparent text-body-lg text-white placeholder:text-white/40 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-block rounded border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
                  ESC
                </span>
              )}
            </div>

            {/* Results List Body */}
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {query.trim() === "" ? (
                <div className="py-10 text-center text-white/50">
                  <p className="text-sm">Type keywords to search across all offerings...</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-caption text-white/40">Popular:</span>
                    {["Numerology", "Rudraksha", "Vastu", "Switchword", "Crystal"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gold-300 hover:bg-gold-500/20 hover:border-gold-500/40 transition-all cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <div className="px-2 py-1 text-xs text-white/40 font-medium flex items-center justify-between">
                    <span>Found {results.length} matching items</span>
                  </div>

                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full text-left flex items-start gap-3.5 rounded-xl border border-white/5 bg-white/5 p-3.5 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all group cursor-pointer"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-950 border border-white/10">
                        {getTypeIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
                              getBadgeStyle(item.type)
                            )}
                          >
                            {item.type}
                          </span>
                          <span className="text-caption text-white/50 truncate">
                            {item.category}
                          </span>
                        </div>

                        <h4 className="mt-1 font-heading text-body font-medium text-white group-hover:text-gold-300 transition-colors truncate">
                          {item.title}
                        </h4>

                        <p className="mt-0.5 text-xs text-white/60 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-center pl-2">
                        {item.price !== undefined && (
                          <span className="text-xs font-semibold text-gold-400">
                            {formatProductPrice(item.price)}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-white/50">
                  <Search className="h-8 w-8 text-white/20 mx-auto mb-3" />
                  <p className="text-body font-medium text-white/80">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-xs text-white/50">
                    Try searching for terms like &ldquo;Rudraksha&rdquo;, &ldquo;Numerology&rdquo;, or &ldquo;Vastu&rdquo;.
                  </p>
                </div>
              )}
            </div>

            {/* Footer info bar */}
            <div className="border-t border-white/10 bg-navy-950 px-4 py-2.5 flex items-center justify-between text-xs text-white/40">
              <span>Vrikszon Occultaura Instant Search</span>
              <button
                type="button"
                onClick={onClose}
                className="text-gold-400 hover:underline font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
