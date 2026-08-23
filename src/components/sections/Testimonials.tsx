"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Play, X, Sparkles, Quote, Video as VideoIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

/**
 * Sacred Geometry Background Watermark (SVG)
 * Provides subtle celestial / mandala depth behind video cards without posters.
 */
const SacredGeometryPattern = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("absolute pointer-events-none stroke-gold-500/20 fill-none", className)}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="46" strokeWidth="0.5" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="36" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="26" strokeWidth="0.5" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="16" strokeWidth="0.5" />
    <path d="M50 4 L50 96 M4 L50 L96 50 M17 17 L83 83 M17 83 L83 17" strokeWidth="0.4" />
    <rect x="25" y="25" width="50" height="50" strokeWidth="0.4" transform="rotate(45 50 50)" />
  </svg>
);

/**
 * Testimonials ("Our Testimonials")
 *
 * Highlights verified client experiences with rich 9:16 portrait video stories.
 * Clicking a video testimonial card launches a full-screen 9:16 video modal.
 */
const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedVideo, setSelectedVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const activeTestimonials = TESTIMONIALS.filter((t) => t.enabled);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedVideo(null);
  }, []);

  // Escape key listener & body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    if (selectedVideo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVideo, handleCloseModal]);

  const handleCardClick = (testimonial: Testimonial) => {
    if (testimonial.videoSrc) {
      setSelectedVideo({
        src: testimonial.videoSrc,
        title: `${testimonial.clientName}'s Experience`,
      });
    }
  };

  const cardVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <SectionHeading
            align="center"
            eyebrow="Our Testimonials"
            heading="Stories of Clarity, Confidence & Transformation"
            description="Listen to verified client experiences from individuals who have sought personalized Numerology and Vastu guidance."
          />
        </div>

        {/* Testimonials Display (Centered Portrait 9:16 Cards) */}
        <div className="flex justify-center items-center">
          {activeTestimonials.map((testimonial) => (
            <motion.article
              key={testimonial.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              onClick={() => handleCardClick(testimonial)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-gold-500/30 bg-navy-950 text-white shadow-md transition-all duration-300 ease-luxury cursor-pointer",
                "w-[260px] sm:w-[300px] md:w-[320px]",
                "hover:border-gold-500 hover:shadow-[0_16px_36px_rgba(8,20,35,0.2),0_0_24px_rgba(212,175,55,0.25)]",
                shouldReduceMotion ? "" : "hover:-translate-y-2"
              )}
            >
              {/* ── Top 9:16 Portrait Media Container ── */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_50%,var(--color-indigo-950)_100%)]">
                {/* Optional Poster Image if provided */}
                {testimonial.posterImage ? (
                  <Image
                    src={testimonial.posterImage}
                    alt={`${testimonial.clientName} testimonial`}
                    fill
                    sizes="(max-width: 640px) 260px, 320px"
                    className="object-cover transition-transform duration-500 ease-luxury group-hover:scale-105"
                  />
                ) : (
                  /* Atmospheric Aesthetic Fallback */
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-6 overflow-hidden">
                    <SacredGeometryPattern className="h-[120%] w-[120%] -top-[10%] opacity-40" />

                    {/* Top Pill: Verified Client Story */}
                    <div className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/40 bg-navy-900/80 backdrop-blur-xs text-[11px] font-semibold text-gold-300 shadow-md">
                      <Sparkles className="h-3 w-3 text-gold-400" />
                      <span>Verified Client Story</span>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-2xl pointer-events-none" />

                    {/* Center: Glowing Animated Play Button */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span className="relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full border border-gold-400 bg-gold-500 text-navy-950 shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-400 group-hover:shadow-[0_0_36px_rgba(212,175,55,0.7)]">
                        <Play className="ml-1 h-7 w-7 text-navy-950" fill="currentColor" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/90 group-hover:text-gold-300 transition-colors">
                        Watch Full Video
                      </span>
                    </div>

                    {/* Bottom: Client Name & Occult Motif */}
                    <div className="relative z-10 w-full text-center">
                      <span className="font-heading text-h4 font-medium text-white block">
                        {testimonial.clientName}
                      </span>
                      <span className="text-[11px] text-gold-400/80 tracking-wide">
                        Numerology Consultation
                      </span>
                    </div>
                  </div>
                )}

                {/* Dark Vignette Overlay for Crisp Text & Accents */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30 pointer-events-none" />

                {/* Corner Golden Accent Lines */}
                <div className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-gold-400/60 pointer-events-none" />
                <div className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-gold-400/60 pointer-events-none" />
                <div className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-gold-400/60 pointer-events-none" />
                <div className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-gold-400/60 pointer-events-none" />
              </div>

              {/* ── Bottom Label Bar ── */}
              <div className="flex items-center justify-between border-t border-gold-500/20 bg-navy-900 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                    <VideoIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-heading text-small font-semibold text-white block leading-tight">
                      {testimonial.clientName}
                    </span>
                    <span className="text-[10px] text-navy-300">Video Story · 9:16</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 group-hover:text-gold-300 transition-colors">
                  <span>Play</span>
                  <Play className="h-2.5 w-2.5" fill="currentColor" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>

      {/* ── 9:16 Full-Screen Story / Reel Video Modal ── */}
      <AnimatePresence>
        {selectedVideo && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedVideo.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-navy-950/90 backdrop-blur-md cursor-pointer"
            />

            {/* Video Card Lightbox Container (9:16 Aspect Ratio, Max 88vh) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center max-h-[88vh] h-full aspect-[9/16] rounded-2xl overflow-hidden border border-gold-500/40 bg-black shadow-2xl"
            >
              {/* Top Floating Bar: Title + Close Button */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white drop-shadow-md">
                    {selectedVideo.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  aria-label="Close video player"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-gold-500 hover:text-navy-950 hover:border-gold-400 transition-all cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Native Video Player */}
              <video
                ref={videoRef}
                src={selectedVideo.src}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain bg-black"
              >
                Your browser does not support HTML5 video playback.
              </video>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;