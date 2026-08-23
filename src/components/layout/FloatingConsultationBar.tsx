"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Calendar, MessageCircle, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_TRIGGER = 480;

/**
 * FloatingConsultationBar — 21st.dev Component Pattern
 *
 * Sticky floating quick-action dock that slides up after scrolling past the hero.
 * Minimizes friction for instant numerology calculations and consultation bookings.
 */
export function FloatingConsultationBar() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > SCROLL_TRIGGER) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 pointer-events-none flex justify-center px-4">
      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.button
            key="minimized-btn"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            onClick={() => setMinimized(false)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-navy-950/90 px-4 py-2.5 text-xs font-semibold text-gold-300 shadow-2xl backdrop-blur-xl hover:bg-navy-900 transition-all shadow-gold-glow"
            aria-label="Expand quick consultation bar"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Cosmic Guidance</span>
            <ChevronUp className="w-3.5 h-3.5 text-gold-400" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded-bar"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative flex items-center gap-2 sm:gap-3 rounded-full border border-gold-500/40 bg-navy-950/90 p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl shadow-gold-glow"
          >
            {/* 1. Book Consultation Primary CTA */}
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-navy-950 hover:bg-gold-400 transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </Link>

            {/* 3. WhatsApp Quick Consultation */}
            <a
              href="https://wa.me/919999999999?text=Hello%20Vrikszon%20Occultaura,%20I%20would%20like%20to%20consult%20regarding%20Vedic%20Numerology%20and%20Vastu."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-all"
              aria-label="Consult on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* 4. Minimize Button */}
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="flex items-center justify-center h-7 w-7 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-1"
              aria-label="Minimize bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
