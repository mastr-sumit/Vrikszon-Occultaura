"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: "admin" | "nav" | "compact";
}

export function ThemeToggle({
  className,
  showLabel = true,
  variant = "admin",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder to avoid hydration mismatch
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-base border border-navy-700/60 bg-navy-950/60 opacity-0",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 rounded-base border transition-all duration-200 cursor-pointer text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400",
          isDark
            ? "border-navy-700 bg-navy-950/80 text-navy-200 hover:text-white hover:border-gold-400/40 hover:bg-navy-900 shadow-sm"
            : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:border-gold-500/60 hover:bg-slate-50 shadow-xs",
          className
        )}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="relative h-4 w-4 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Moon className="h-3.5 w-3.5 text-indigo-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showLabel && (
          <span className="hidden sm:inline font-medium">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </button>
    );
  }

  if (variant === "nav") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={cn(
          "group relative inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
          isDark
            ? "border-gold-500/30 bg-navy-800/80 text-gold-400 hover:border-gold-500 hover:bg-navy-800"
            : "border-slate-300 bg-white/90 text-slate-700 hover:border-gold-500 hover:bg-slate-100",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun-nav"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-4.5 w-4.5 text-gold-400 transition-transform group-hover:scale-110" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-nav"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-4.5 w-4.5 text-indigo-600 transition-transform group-hover:scale-110" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // Compact variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-base border transition-colors cursor-pointer",
        isDark
          ? "border-navy-700 bg-navy-950/80 text-gold-400 hover:bg-navy-900"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
    </button>
  );
}
