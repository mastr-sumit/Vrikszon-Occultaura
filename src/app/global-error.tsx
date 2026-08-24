"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL_APPLICATION_ERROR]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0b0c10] text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white/[0.03] border border-gold-500/20 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <AlertTriangle className="w-8 h-8 text-gold-400" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-white mb-3">
            System Error
          </h1>

          <p className="text-neutral-300 text-sm leading-relaxed mb-8">
            A critical error occurred while rendering the application. Please reload or try again shortly.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-medium text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Page
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
