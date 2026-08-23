"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MessageCircle, CalendarCheck, Sparkles, Search, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { PRODUCTS, type Product } from "@/data/products";
import { ShopCard } from "./ShopCard";

/**
 * ShopGrid
 *
 * Renders all enabled products from products.ts grouped by category, with
 * a live search bar for instant category & name discovery.
 * Categories are ordered by their first appearance in products.ts.
 *
 * For each category group, a responsive grid (4 cols desktop, 2 tablet, 1 mobile)
 * is rendered with an independent scroll-triggered staggered reveal.
 * Hides any category group that ends up with zero matching products after filtering.
 */
const ShopGrid = () => {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const enabledProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.enabled);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return enabledProducts;
    return enabledProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(q);
      const descMatch = product.shortDescription.toLowerCase().includes(q);
      const categoryMatch = product.category.toLowerCase().includes(q);
      return nameMatch || descMatch || categoryMatch;
    });
  }, [enabledProducts, searchQuery]);

  const { categories, productsByCategory } = useMemo(() => {
    const categoryOrder: string[] = [];
    const grouped: Record<string, Product[]> = {};

    filteredProducts.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
        categoryOrder.push(product.category);
      }
      grouped[product.category].push(product);
    });

    return {
      categories: categoryOrder,
      productsByCategory: grouped,
    };
  }, [filteredProducts]);

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 35 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  const closingVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <>
      {/* Main Catalogue Section */}
      <section aria-label="Product Catalogue" className="bg-warm-white py-16 md:py-20 lg:py-24 xl:py-28">
        <Container size="wide">
          {/* Section Intro */}
          <SectionHeading
            align="center"
            eyebrow="Spiritual Catalogue"
            heading={
              <>
                Explore Our <span className="text-gold-600">Sacred Collection</span>
              </>
            }
            description="Browse our authentic gemstone crystals, Rudraksha malas, energised healing bracelets, and Vastu plates grouped by spiritual purpose."
          />

          {/* ── Search Bar & Results Counter ── */}
          <div className="mt-8 mb-12 flex flex-col gap-4">
            <div className="relative max-w-xl mx-auto w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gold-600">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category (e.g. Rudraksha, Bracelet, Crystal)..."
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

            <div className="flex items-center justify-between text-xs text-text-secondary px-2 max-w-6xl mx-auto w-full">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of {enabledProducts.length} products
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gold-700 font-semibold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Category Groups or Empty Search State */}
          {categories.length > 0 ? (
            <div className="flex flex-col gap-16 md:gap-20">
              {categories.map((category) => {
                const categoryProducts = productsByCategory[category];
                return (
                  <div key={category} className="flex flex-col gap-8">
                    {/* Category Header */}
                    <div className="flex flex-col gap-2 border-b border-gold-500/20 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-heading text-h3 font-medium text-navy-900">
                          {category}
                        </h2>
                        <span className="rounded-full bg-gold-100 px-3 py-1 text-caption font-semibold text-gold-800">
                          {categoryProducts.length} {categoryProducts.length === 1 ? "Item" : "Items"}
                        </span>
                      </div>
                    </div>

                    {/* Staggered Responsive Product Grid per Category */}
                    <motion.div
                      variants={gridVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8"
                    >
                      {categoryProducts.map((product) => (
                        <ShopCard key={product.id} product={product} variants={cardVariants} />
                      ))}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Search State */
            <div className="rounded-2xl border border-navy-900/10 bg-white p-12 text-center max-w-lg mx-auto shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-medium text-navy-950 mb-2">
                No matching products found
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mb-6">
                We couldn&apos;t find any product matching &ldquo;{searchQuery}&rdquo;. Try using different keywords like Rudraksha, Bracelet, or Crystal.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold text-navy-950 hover:bg-gold-400 transition-all shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                View All Products
              </button>
            </div>
          )}
        </Container>
      </section>

      {/*
       * Merged Pre-Footer CTA Section
       *
       * Seamless transition from shop catalogue into the site-wide dark navy Footer.
       * Full-width dark navy background matching Footer's bg-navy-900/950 theme,
       * featuring a wide, prominent, clear CTA banner.
       */}
      <section
        aria-label="Spiritual Guidance Consultation"
        className="relative overflow-hidden bg-navy-950 pt-16 pb-20 md:pt-20 md:pb-24 border-t border-gold-500/30"
      >
        {/* Ambient atmospheric radial gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15)_0%,transparent_70%)]"
        />

        <Container size="wide" className="relative z-10">
          <motion.div
            variants={closingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mx-auto max-w-[1080px] rounded-3xl border border-gold-500/30 bg-navy-900/80 p-8 shadow-2xl backdrop-blur-md md:p-14 lg:p-16 text-center"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.15em] text-gold-400">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
              Personalised Energy Guidance
            </div>

            {/* Clear, Wide Garamond Headline */}
            <h2 className="mt-5 font-heading text-h2 font-medium text-white md:text-h1 leading-tight">
              Not Sure Which Crystal or Mala Suits Your Energy?
            </h2>

            {/* Subheading / Description */}
            <p className="mx-auto mt-4 max-w-[760px] text-body-lg text-white/80 leading-relaxed">
              Our expert numerologist analyzes your personal birth chart, planetary alignments,
              and spiritual energy field to recommend the exact energised tools for your balance and success.
            </p>

            {/* Wide, Prominent Dual Action Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                href="/services"
                variant="primary"
                size="lg"
                leftIcon={<CalendarCheck className="h-5 w-5" />}
                className="w-full sm:w-auto min-w-[240px] shadow-gold-glow"
              >
                Book a Consultation
              </Button>

              <Button
                href="https://wa.me/919073190525"
                variant="secondary"
                size="lg"
                leftIcon={<MessageCircle className="h-5 w-5 text-gold-400" />}
                className="w-full sm:w-auto min-w-[240px] border-gold-500/40 text-white hover:bg-gold-500/10 hover:border-gold-500"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default ShopGrid;
