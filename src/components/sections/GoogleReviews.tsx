"use client";

import { ExternalLink, MessageSquareText, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_SUMMARY } from "@/data/googleReviews";

/**
 * GoogleReviews ("Real Reviews from Google")
 *
 * The second of three planned, independently-modular social-proof sections
 * (Testimonials -> GoogleReviews -> future ClientReviews). Placed
 * immediately after Testimonials in src/data/homepageSections.ts.
 *
 * This section is reserved specifically for legitimate Google Business
 * Profile / Places review data — it never renders curated testimonials
 * (that stays in Testimonials.tsx / the future ClientReviews.tsx).
 *
 * All content comes from src/data/googleReviews.ts. No verified Google
 * review data currently exists in this project (no confirmed Places API
 * credentials, no confirmed Business Profile), so `GOOGLE_REVIEWS` is an
 * empty array and every `GOOGLE_REVIEWS_SUMMARY` field is `null`. Nothing
 * in this file fabricates a reviewer, rating, quote, or review count —
 * when the data source is empty/null, the section renders a single,
 * intentional "integration ready" panel instead of fake cards or a
 * "0 reviews" style message that could misread as the business having no
 * reviews.
 *
 * FUTURE INTEGRATION POINT
 * When src/data/googleReviews.ts is populated with verified data (or swapped
 * for a real server-side Google integration returning the same shapes), this
 * component automatically renders the live summary bar + review grid below —
 * no redesign required. See the two branches gated on `hasReviews`.
 */
const GoogleReviews = () => {
  const shouldReduceMotion = useReducedMotion();

  const summary = GOOGLE_REVIEWS_SUMMARY;
  const reviews = GOOGLE_REVIEWS;
  const hasReviews = reviews.length > 0;

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <SectionHeading
          eyebrow="Real Reviews From Google"
          heading="Trusted Experiences, Shared Honestly"
          description="Verified Google feedback offers a transparent, third-party view of client experiences — reviews appear here directly once the Google Business Profile integration is connected."
        />

        {hasReviews ? (
          <>
            {/* Summary bar — renders once averageRating/totalReviews are verified. */}
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={itemVariants}
              className={cn(
                "mt-10 flex flex-col gap-6 rounded-lg border border-navy-100 bg-navy-50/60 p-xl",
                "sm:flex-row sm:items-center sm:justify-between"
              )}
            >
              <div className="flex items-center gap-4">
                {summary.averageRating !== null && (
                  <span className="font-heading text-h2 font-medium text-navy-900">
                    {summary.averageRating.toFixed(1)}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  {summary.averageRating !== null && (
                    <div
                      className="flex items-center gap-1"
                      role="img"
                      aria-label={`Rated ${summary.averageRating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-5",
                            index < Math.round(summary.averageRating as number)
                              ? "fill-gold-500 text-gold-500"
                              : "fill-transparent text-navy-200"
                          )}
                          strokeWidth={1.75}
                        />
                      ))}
                    </div>
                  )}
                  {summary.totalReviews !== null && (
                    <span className="text-small text-text-secondary">
                      Based on {summary.totalReviews} Google reviews
                    </span>
                  )}
                </div>
              </div>

              {summary.googleBusinessUrl && (
                <a
                  href={summary.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-body font-medium text-navy-900 underline-offset-4",
                    "hover:underline",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-sm"
                  )}
                >
                  View on Google
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </motion.div>

            {/* Review cards — 3 desktop / 2 tablet / 1 mobile via responsive grid. */}
            <motion.div
              variants={gridVariants}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={itemVariants}>
                  <Card className="flex h-full flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-50 text-navy-700">
                        {review.reviewerAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={review.reviewerAvatar}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-body-lg font-medium">
                            {review.reviewerName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-h6 font-medium text-navy-900">
                          {review.reviewerName}
                        </span>
                        <span className="text-small text-text-secondary">
                          {review.relativeTime}
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      role="img"
                      aria-label={`Rated ${review.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className={cn(
                            "h-4 w-4",
                            index < review.rating
                              ? "fill-gold-500 text-gold-500"
                              : "fill-transparent text-navy-200"
                          )}
                          strokeWidth={1.75}
                        />
                      ))}
                    </div>

                    <p className="flex-1 text-body text-text-secondary">
                      {review.text}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          /*
            EMPTY / INTEGRATION-READY STATE
            No verified Google Business Profile data is connected yet. This
            single panel intentionally replaces the summary bar + review
            grid above — never fabricated reviews, ratings, or a "0
            reviews" message that could misread as the business having no
            reviews.
          */
          <motion.div
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={itemVariants}
            className={cn(
              "mt-10 flex flex-col items-center gap-4 rounded-lg border border-navy-100",
              "bg-[linear-gradient(135deg,var(--color-navy-50)_0%,var(--color-indigo-50)_100%)]",
              "px-xl py-3xl text-center sm:px-3xl"
            )}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700">
              <MessageSquareText className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            </span>
            <p className="font-heading text-h4 font-medium text-navy-900">
              Google Reviews Integration Ready
            </p>
            <p className="max-w-reading text-body text-text-secondary">
              Verified Google reviews will appear here as soon as the
              business profile integration is connected. No reviews are
              shown until they can be confirmed as genuine.
            </p>
          </motion.div>
        )}
      </Container>
    </section>
  );
};

export default GoogleReviews;