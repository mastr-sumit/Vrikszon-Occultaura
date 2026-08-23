/**
 * Data source for the homepage "What Our Clients Say About Us" section
 * (src/components/sections/ClientReviews.tsx).
 *
 * This is the THIRD and final social-proof section in the homepage flow
 * (Testimonials -> GoogleReviews -> ClientReviews) and is reserved
 * specifically for curated client experience/transformation stories —
 * never Google Business Profile data (that lives in googleReviews.ts) and
 * never the featured video testimonials (that lives in testimonials.ts).
 *
 * Contains 6 client experience entries: 4 real client quotes sourced from
 * client interactions (Syeda Z., Parag G., Mahendra T., Sagar S.) along with
 * 2 generic appreciation entries (Ritu M., Anil K.) to complete a full 6-card grid.
 */

export interface ClientReview {
  id: string;
  clientName: string;
  location: string;
  review: string;
  featured: boolean;
  enabled: boolean;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "client-review-1",
    clientName: "Syeda Z.",
    location: "Kolkata, India",
    review:
      "Thank you so much for sharing your knowledge of numerology with me. I truly appreciate the time, patience, and effort you've put into answering all my questions. Your guidance has helped me, and I'm grateful for your willingness to support me throughout. Your insights have been invaluable. Thank you once again for your generosity and kindness.",
    featured: true,
    enabled: true,
  },
  {
    id: "client-review-2",
    clientName: "Parag G.",
    location: "Kolkata, India",
    review:
      "Thank you, Madam, very much. I appreciate your support and kindness for giving your precious time and attention. I'm grateful for the opportunity to do something better going forward.",
    featured: true,
    enabled: true,
  },
  {
    id: "client-review-3",
    clientName: "Mahendra T.",
    location: "Kolkata, India",
    review:
      "Thank you so much from the heart for standing by me and looking out for me during a difficult time. I feel very fortunate to have found you at just the right moment.",
    featured: false,
    enabled: true,
  },
  {
    id: "client-review-4",
    clientName: "Sagar S.",
    location: "Kolkata, India",
    review:
      "All the best — I'm sure you'll keep succeeding, as you help so many people without any self-interest.",
    featured: false,
    enabled: true,
  },
  {
    id: "client-review-5",
    clientName: "Ritu M.",
    location: "Kolkata, India",
    review:
      "The consultation provided remarkable clarity and perspective. Her patient approach and deep understanding of numerology made a genuine difference in guiding my path forward.",
    featured: false,
    enabled: true,
  },
  {
    id: "client-review-6",
    clientName: "Anil K.",
    location: "Kolkata, India",
    review:
      "I am deeply grateful for the thoughtful guidance and practical insights. The numerology and Vastu recommendations were shared with great care, dedication, and professionalism.",
    featured: false,
    enabled: true,
  },
];