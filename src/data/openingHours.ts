/**
 * Opening-hours data for the homepage BookingSection.
 *
 * No exact business hours are verified anywhere in the project docs
 * (project.md, content.md, homepage-breakdown.md, sitemap.md) — only
 * that consultations exist and are booked by appointment. Per this
 * task's explicit instruction, exact hours are NOT invented here.
 *
 * `OPENING_HOURS_VERIFIED` stays `false` until real hours are supplied.
 * When they are, populate each entry's `hours` field (e.g. "10:00 AM –
 * 6:00 PM") and flip the flag to `true` — BookingSection.tsx already
 * reads both and will switch from the "by appointment" message to the
 * real schedule automatically, no component changes required.
 */

export interface OpeningHoursEntry {
  /** e.g. "Monday – Saturday" */
  days: string;
  /** `null` = not yet verified/TBD — do not fabricate a time here. */
  hours: string | null;
}

/** Set to `true` once real, client-confirmed hours are entered below. */
export const OPENING_HOURS_VERIFIED = false;

/** Shown instead of fake hours while OPENING_HOURS_VERIFIED is false. */
export const OPENING_HOURS_FALLBACK_MESSAGE =
  "Consultation hours available by appointment.";

export const OPENING_HOURS: OpeningHoursEntry[] = [
  { days: "Monday – Saturday", hours: null },
  { days: "Sunday", hours: null },
];