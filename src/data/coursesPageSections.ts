import type { ComponentType } from "react";
import CoursesHero from "@/components/courses/CoursesHero";
import CoursesGrid from "@/components/courses/CoursesGrid";

/**
 * A single entry in the Courses page's section configuration.
 *
 * - `id`        — stable, unique key used for React's `key` prop.
 * - `component` — the section's React component reference (not JSX),
 *                 so src/app/courses/page.tsx can render it dynamically.
 * - `enabled`   — set to `false` to remove a section from the Courses page.
 */
export interface CoursesSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Courses page section configuration.
 * Sections render in array order: hero → grid.
 */
export const coursesPageSections: CoursesSection[] = [
  { id: "courses-hero", component: CoursesHero, enabled: true },
  { id: "courses-grid", component: CoursesGrid, enabled: true },
];
