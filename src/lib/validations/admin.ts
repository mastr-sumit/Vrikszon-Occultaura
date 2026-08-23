import { z } from "zod";

/**
 * Product Validation Schemas
 */
export const createProductSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  subtitle: z.string().optional().nullable(),
  benefits: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  price: z.number().int().min(0, "Price must be a positive integer or 0").optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().default("sparkles"),
  featured: z.boolean().default(false),
  enabled: z.boolean().default(true),
  href: z.string().optional().nullable(),
  variantsNote: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

/**
 * Course Validation Schemas
 */
export const createCourseSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  title: z.string().min(1, "Title is required"),
  category: z.string().optional().nullable(),
  image: z.string().min(1, "Image path or URL is required"),
  price: z.number().int().min(0, "Price must be a positive integer or 0").optional().nullable(),
  originalPrice: z.number().int().min(0, "Original price must be a positive integer or 0").optional().nullable(),
  shortDescription: z.string().min(1, "Short description is required"),
  enrollHref: z.string().min(1, "Enroll href is required"),
  enabled: z.boolean().default(true),
});

export const updateCourseSchema = createCourseSchema.partial();
