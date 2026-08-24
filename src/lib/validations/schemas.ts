import { z } from "zod";

/**
 * ─────────────────────────────────────────────────────────────
 * Regex & Common Validation Patterns
 * ─────────────────────────────────────────────────────────────
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PHONE_REGEX = /^[+]?[0-9\s-]{8,20}$/;
export const PINCODE_REGEX = /^[0-9A-Za-z\s-]{4,10}$/;
export const ID_REGEX = /^[a-zA-Z0-9_-]{1,128}$/;
export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * ─────────────────────────────────────────────────────────────
 * 1. Authentication Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Email must be at least 3 characters")
      .max(255, "Email cannot exceed 255 characters")
      .email("Please provide a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password cannot exceed 128 characters"),
    csrfToken: z.string().max(256).optional(),
    callbackUrl: z.string().max(2048).optional(),
    redirect: z.union([z.boolean(), z.string()]).optional(),
  })
  .strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 2. E-Commerce / Order Creation Schemas (/api/orders)
 * ─────────────────────────────────────────────────────────────
 */
export const orderItemSchema = z
  .object({
    productId: z
      .string()
      .trim()
      .min(1, "Product ID cannot be empty")
      .max(100, "Product ID too long"),
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .min(1, "Quantity must be at least 1")
      .max(100, "Quantity cannot exceed 100 per item"),
  })
  .strict();

export const createOrderSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Email must be at least 3 characters")
      .max(255, "Email cannot exceed 255 characters")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 digits")
      .max(20, "Phone number cannot exceed 20 characters")
      .regex(PHONE_REGEX, "Please enter a valid telephone number"),
    addressLine1: z
      .string()
      .trim()
      .min(3, "Address Line 1 must be at least 3 characters")
      .max(200, "Address Line 1 cannot exceed 200 characters"),
    addressLine2: z
      .string()
      .trim()
      .max(200, "Address Line 2 cannot exceed 200 characters")
      .optional()
      .nullable(),
    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100, "City cannot exceed 100 characters"),
    state: z
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(100, "State cannot exceed 100 characters"),
    pincode: z
      .string()
      .trim()
      .min(4, "Pincode must be at least 4 characters")
      .max(10, "Pincode cannot exceed 10 characters")
      .regex(PINCODE_REGEX, "Please enter a valid postal pincode"),
    items: z
      .array(orderItemSchema)
      .min(1, "Order must contain at least 1 item")
      .max(50, "Order cannot exceed 50 distinct items"),
  })
  .strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 3. Consultation Booking & Lead Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const createBookingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Email must be at least 3 characters")
      .max(255, "Email cannot exceed 255 characters")
      .email("Please provide a valid email address"),
    phone: z
      .string()
      .trim()
      .min(8, "Phone must be at least 8 characters")
      .max(20, "Phone cannot exceed 20 characters")
      .regex(PHONE_REGEX, "Please provide a valid phone number"),
    service: z
      .string()
      .trim()
      .min(1, "Service is required")
      .max(100, "Service name cannot exceed 100 characters"),
    preferredDate: z
      .string()
      .trim()
      .max(50, "Date string too long")
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          const parsed = new Date(val);
          if (isNaN(parsed.getTime())) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 90);
          maxDate.setHours(23, 59, 59, 999);
          return parsed >= today && parsed <= maxDate;
        },
        {
          message: "Preferred session date must be between today and the next 90 days",
        }
      ),
    dob: z
      .string()
      .trim()
      .max(50)
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          const parsed = new Date(val);
          if (isNaN(parsed.getTime())) return false;
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 120);
          minDate.setHours(0, 0, 0, 0);
          return parsed <= today && parsed >= minDate;
        },
        {
          message: "Date of birth cannot be in the future or older than 120 years",
        }
      ),
    tob: z.string().trim().max(50).optional().nullable(),
    pob: z.string().trim().max(200).optional().nullable(),
    message: z
      .string()
      .trim()
      .max(3000, "Message cannot exceed 3000 characters")
      .optional()
      .nullable(),
  })
  .strict();

export const updateBookingStatusSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "Booking ID cannot be empty")
      .max(100, "Booking ID too long")
      .regex(ID_REGEX, "Invalid booking ID format"),
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  })
  .strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 4. Contact Message Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const createContactMessageSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Email must be at least 3 characters")
      .max(255, "Email cannot exceed 255 characters")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone cannot exceed 20 characters")
      .regex(PHONE_REGEX, "Please provide a valid phone number")
      .optional()
      .nullable(),
    reason: z
      .string()
      .trim()
      .min(1, "Reason is required")
      .max(100, "Reason cannot exceed 100 characters"),
    message: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(3000, "Message cannot exceed 3000 characters"),
    dob: z
      .string()
      .trim()
      .max(50)
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          const parsed = new Date(val);
          if (isNaN(parsed.getTime())) return false;
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 120);
          minDate.setHours(0, 0, 0, 0);
          return parsed <= today && parsed >= minDate;
        },
        {
          message: "Date of birth cannot be in the future or older than 120 years",
        }
      ),
    tob: z.string().trim().max(50).optional().nullable(),
    pob: z.string().trim().max(200).optional().nullable(),
  })
  .strict();

export const updateMessageSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "Message ID cannot be empty")
      .max(100, "Message ID too long")
      .regex(ID_REGEX, "Invalid message ID format"),
    isRead: z.boolean(),
  })
  .strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 5. Admin Product Management Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const createProductSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(100, "Slug cannot exceed 100 characters")
      .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric characters separated by single hyphens"),
    name: z
      .string()
      .trim()
      .min(1, "Product Name is required")
      .max(150, "Product Name cannot exceed 150 characters"),
    category: z
      .string()
      .trim()
      .min(1, "Category is required")
      .max(100, "Category cannot exceed 100 characters"),
    shortDescription: z
      .string()
      .trim()
      .min(1, "Short description is required")
      .max(1000, "Short description cannot exceed 1000 characters"),
    subtitle: z
      .string()
      .trim()
      .max(255, "Subtitle cannot exceed 255 characters")
      .optional()
      .nullable(),
    benefits: z
      .union([
        z.array(z.string().trim().max(255, "Benefit item too long")).max(20, "Cannot exceed 20 benefits"),
        z.string().trim().max(2000, "Benefits string too long"),
      ])
      .optional()
      .nullable(),
    price: z
      .number()
      .int("Price must be an integer value in rupees")
      .min(0, "Price must be 0 or a positive integer")
      .max(100000000, "Price exceeds maximum allowable limit")
      .optional()
      .nullable(),
    image: z
      .string()
      .trim()
      .max(500, "Image path cannot exceed 500 characters")
      .optional()
      .nullable(),
    icon: z
      .string()
      .trim()
      .max(50, "Icon name cannot exceed 50 characters")
      .default("sparkles"),
    featured: z.boolean().default(false),
    enabled: z.boolean().default(true),
    href: z
      .string()
      .trim()
      .max(500, "Href cannot exceed 500 characters")
      .optional()
      .nullable(),
    variantsNote: z
      .string()
      .trim()
      .max(500, "Variants note cannot exceed 500 characters")
      .optional()
      .nullable(),
  })
  .strict();

export const updateProductSchema = createProductSchema.partial().strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 6. Admin Course Management Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const createCourseSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(100, "Slug cannot exceed 100 characters")
      .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric characters separated by single hyphens"),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    category: z
      .string()
      .trim()
      .max(100, "Category cannot exceed 100 characters")
      .optional()
      .nullable(),
    image: z
      .string()
      .trim()
      .min(1, "Image path is required")
      .max(500, "Image path cannot exceed 500 characters"),
    price: z
      .number()
      .int("Price must be an integer in rupees")
      .min(0, "Price must be 0 or greater")
      .max(100000000, "Price exceeds allowable limit")
      .optional()
      .nullable(),
    originalPrice: z
      .number()
      .int("Original price must be an integer in rupees")
      .min(0, "Original price must be 0 or greater")
      .max(100000000, "Original price exceeds allowable limit")
      .optional()
      .nullable(),
    shortDescription: z
      .string()
      .trim()
      .min(1, "Short description is required")
      .max(2000, "Short description cannot exceed 2000 characters"),
    enrollHref: z
      .string()
      .trim()
      .min(1, "Enroll link is required")
      .max(500, "Enroll link cannot exceed 500 characters"),
    enabled: z.boolean().default(true),
  })
  .strict();

export const updateCourseSchema = createCourseSchema.partial().strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 7. Admin Testimonials Schemas
 * ─────────────────────────────────────────────────────────────
 */
export const createTestimonialSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(1, "Client Name is required")
      .max(150, "Client Name cannot exceed 150 characters"),
    clientRoleOrLocation: z
      .string()
      .trim()
      .max(150, "Client role/location cannot exceed 150 characters")
      .optional()
      .nullable(),
    quote: z
      .string()
      .trim()
      .max(2000, "Quote cannot exceed 2000 characters")
      .optional()
      .nullable(),
    videoSrc: z
      .string()
      .trim()
      .max(500, "Video source path cannot exceed 500 characters")
      .optional()
      .nullable(),
    posterImage: z
      .string()
      .trim()
      .max(500, "Poster image path cannot exceed 500 characters")
      .optional()
      .nullable(),
    featured: z.boolean().default(false),
    enabled: z.boolean().default(true),
  })
  .strict();

export const updateTestimonialSchema = createTestimonialSchema.partial().strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 8. Admin Order Status Update Schema
 * ─────────────────────────────────────────────────────────────
 */
export const updateOrderStatusSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "Order ID cannot be empty")
      .max(100, "Order ID too long")
      .regex(ID_REGEX, "Invalid order ID format"),
    status: z
      .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
      .optional(),
    paymentStatus: z
      .enum(["UNPAID", "PAID", "REFUNDED"])
      .optional(),
  })
  .strict();

/**
 * ─────────────────────────────────────────────────────────────
 * 9. Resource ID Route Param Schema
 * ─────────────────────────────────────────────────────────────
 */
export const resourceIdSchema = z
  .string()
  .trim()
  .min(1, "ID cannot be empty")
  .max(100, "ID cannot exceed 100 characters")
  .regex(ID_REGEX, "Resource ID contains invalid characters");

// Aliases for route handlers
export const updateBookingSchema = updateBookingStatusSchema;
export const updateContactMessageSchema = updateMessageSchema;
export const updateOrderSchema = updateOrderStatusSchema;

