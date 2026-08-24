import Link from "next/link";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white/[0.03] border border-gold-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Compass className="w-8 h-8 text-gold-400 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs uppercase tracking-widest font-mono mb-4">
            <Sparkles className="w-3 h-3" />
            404 Page Not Found
          </div>

          <h1 className="text-3xl font-serif font-bold text-white mb-3">
            Path Not Found
          </h1>

          <p className="text-neutral-300 text-sm leading-relaxed mb-8">
            The page you are looking for does not exist or may have been relocated across the cosmic realm.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-medium text-sm transition-colors shadow-lg shadow-gold-500/20"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
