/**
 * Data source for the homepage "Real Reviews from Google" section
 * (src/components/sections/GoogleReviews.tsx).
 *
 * ============================================================================
 * VERIFICATION STATUS: NO VERIFIED GOOGLE REVIEW DATA EXISTS IN THIS PROJECT.
 * ============================================================================
 * None of project.md, content.md, or any other project doc contains a
 * confirmed Google Business Profile, Places API credential, review, rating,
 * or review count for Vrikszon Occultaura. Per this task's explicit
 * instructions, nothing below is fabricated: no invented reviewer names, no
 * invented ratings, no invented review counts, no invented overall rating.
 *
 * `GOOGLE_REVIEWS` is intentionally an empty array and `GOOGLE_REVIEWS_SUMMARY`
 * intentionally uses `null` for every metric. GoogleReviews.tsx is built to
 * render a premium, intentional "integration ready" empty state whenever
 * this file looks like it does right now.
 *
 * FUTURE INTEGRATION POINT
 * ------------------------
 * Once the client's Google Business Profile is verified and legitimate
 * access (Google Places API / Business Profile API) is set up:
 *   1. Replace `GOOGLE_REVIEWS_SUMMARY` below with real values
 *      (averageRating, totalReviews, googleBusinessUrl).
 *   2. Replace `GOOGLE_REVIEWS` with real review objects, OR — better —
 *      swap this static export for a server-side fetch (e.g. a cached
 *      Server Component data call) that returns data shaped exactly like
 *      `GoogleReview[]`/`GoogleReviewsSummary` below. Because
 *      GoogleReviews.tsx only depends on these two exported shapes, no
 *      redesign of the component is required either way.
 * This file does NOT call any API, does NOT read any environment variable,
 * and does NOT contain any credentials — it is data/type architecture only.
 */

/** A single individual Google review, once verified data exists. */
export interface GoogleReview {
  id: string;
  reviewerName: string;
  /** Local or Google-hosted avatar URL. `null` until available. */
  reviewerAvatar: string | null;
  /** 1-5. Never populate this with an invented value. */
  rating: number;
  text: string;
  /** Human-relative string, e.g. "2 weeks ago" — as Google's API returns it. */
  relativeTime: string;
  /** True only once sourced directly from a verified Google integration. */
  verified: boolean;
}

/** Aggregate Google Business Profile stats shown above the review cards. */
export interface GoogleReviewsSummary {
  /** Overall Google rating (e.g. 4.8). `null` until verified. */
  averageRating: number | null;
  /** Total review count on the Google Business Profile. `null` until verified. */
  totalReviews: number | null;
  /** Link to the live Google Business Profile / review page, once known. */
  googleBusinessUrl: string | null;
}

/**
 * No verified Google Business Profile / Places data is currently connected.
 * Keep this an empty array until real reviews are sourced — do not add
 * realistic-looking placeholder reviews here.
 */
export const GOOGLE_REVIEWS: GoogleReview[] = [];

/**
 * No verified Google Business Profile data is currently connected.
 * Keep every field `null` until the business profile integration goes live.
 */
export const GOOGLE_REVIEWS_SUMMARY: GoogleReviewsSummary = {
  averageRating: null,
  totalReviews: null,
  googleBusinessUrl: null,
};