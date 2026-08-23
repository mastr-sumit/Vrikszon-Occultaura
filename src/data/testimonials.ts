/**
 * Testimonial data for the homepage "Our Testimonials" section
 * (src/components/sections/Testimonials.tsx).
 *
 * Replaced placeholder entries with real client video testimonial (Chetan).
 * Additional client testimonials will be added dynamically via admin / data entries.
 */

export interface Testimonial {
  id: string;
  clientName: string;
  clientRoleOrLocation?: string | null;
  quote?: string | null;
  videoSrc?: string | null;
  posterImage?: string | null;
  featured: boolean;
  enabled: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-chetan",
    clientName: "Chetan",
    clientRoleOrLocation: null,
    quote: null,
    videoSrc: "/videos/testimonials/chetan.mp4",
    posterImage: null, // /images/testimonials/chetan-poster.jpg will be connected once available
    featured: true,
    enabled: true,
  },
];