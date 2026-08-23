import { Phone, Mail, MapPin, Clock, type LucideIcon } from "lucide-react";

export interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

/**
 * Contact details. Location is real (content.md: "Salt Lake City,
 * Kolkata"). Phone, email and hours are placeholders — project.md
 * lists "Final Contact Details" under Pending Client Information —
 * formatted as real values would be so the layout is production-ready,
 * to be swapped once the client confirms them.
 */
export const CONTACT_ITEMS: ContactItem[] = [
  { icon: Phone, label: "Phone", value: "+91 90731 90525", href: "tel:+919073190525" },
  { icon: Mail, label: "Email", value: "vrikszonoccultaura9@gmail.com", href: "mailto:vrikszonoccultaura9@gmail.com" },
  { icon: MapPin, label: "Location", value: "Salt Lake City, Kolkata", href: undefined },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat, 10:00 AM – 7:00 PM", href: undefined },
];
