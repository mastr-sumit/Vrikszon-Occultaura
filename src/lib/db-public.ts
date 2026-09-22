import { prisma } from "@/lib/prisma";
import { type Product, type ProductIcon } from "@/data/products";
import { type Course, type CourseCategory } from "@/data/courses";
import { type TestimonialItem } from "@/components/sections/Testimonials";

/**
 * Format raw DB product into the UI Product type
 */
function formatDbProduct(p: {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  subtitle?: string | null;
  benefits?: string | null;
  price: number | null;
  image: string | null;
  icon: string;
  featured: boolean;
  enabled: boolean;
  archived: boolean;
  href?: string | null;
  variantsNote?: string | null;
}): Product {
  let benefits: string[] | undefined = undefined;
  if (p.benefits) {
    try {
      const parsed = JSON.parse(p.benefits);
      if (Array.isArray(parsed)) benefits = parsed;
    } catch {
      benefits = [p.benefits];
    }
  }

  const validIcon: ProductIcon = ["gem", "book", "triangle", "sparkles"].includes(
    p.icon as ProductIcon
  )
    ? (p.icon as ProductIcon)
    : "sparkles";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    shortDescription: p.shortDescription,
    subtitle: p.subtitle || undefined,
    benefits,
    price: p.price,
    image: p.image,
    icon: validIcon,
    featured: p.featured,
    enabled: p.enabled,
    href: p.href || "/shop",
    variantsNote: p.variantsNote || undefined,
  };
}

/**
 * Fetch all active, non-archived products from DB for Shop page
 */
export async function getPublicProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        archived: false,
        enabled: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return dbProducts.map(formatDbProduct);
  } catch (error) {
    console.error("[getPublicProducts] DB fetch error:", error);
    return [];
  }
}

/**
 * Fetch featured active products for Homepage
 */
export async function getPublicFeaturedProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        archived: false,
        enabled: true,
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return dbProducts.map(formatDbProduct);
  } catch (error) {
    console.error("[getPublicFeaturedProducts] DB fetch error:", error);
    return [];
  }
}

/**
 * Fetch active courses for Courses page & Homepage
 */
export async function getPublicCourses(): Promise<Course[]> {
  try {
    const dbCourses = await prisma.course.findMany({
      where: {
        enabled: true,
      },
      include: {
        categoryRel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return dbCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.categoryRel?.name || c.category || "Uncategorized",
      categoryId: c.categoryId || undefined,
      categorySlug:
        c.categoryRel?.slug ||
        (c.category ? c.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "uncategorized"),
      image: c.image,
      price: c.price,
      originalPrice: c.originalPrice,
      shortDescription: c.shortDescription,
      enrollHref: c.enrollHref || "/book-consultation",
      enabled: c.enabled,
    }));
  } catch (error) {
    console.error("[getPublicCourses] DB fetch error:", error);
    return [];
  }
}

/**
 * Fetch active course categories with live course counts
 */
export async function getPublicCourseCategories(): Promise<CourseCategory[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      where: {
        type: "COURSE",
      },
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            courses: {
              where: { enabled: true },
            },
          },
        },
      },
    });

    return dbCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count.courses,
    }));
  } catch (error) {
    console.error("[getPublicCourseCategories] DB fetch error:", error);
    return [];
  }
}

import { type Service } from "@/data/services";

/**
 * Fetch active services for Services page & Consultation Booking
 */
export async function getPublicServices(): Promise<Service[]> {
  try {
    const dbServices = await prisma.service.findMany({
      where: {
        archived: false,
        enabled: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      category: s.category,
      shortDescription: s.shortDescription,
      price: s.price,
      durationMinutes: s.durationMinutes || undefined,
      image: s.image,
      featured: s.featured,
      enabled: s.enabled,
      href: s.href || "/services",
    }));
  } catch (error) {
    console.error("[getPublicServices] DB fetch error:", error);
    return [];
  }
}

/**
 * Fetch active featured services for Homepage carousel
 */
export async function getPublicFeaturedServices(): Promise<Service[]> {
  try {
    const dbServices = await prisma.service.findMany({
      where: {
        archived: false,
        enabled: true,
        featured: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      category: s.category,
      shortDescription: s.shortDescription,
      price: s.price,
      durationMinutes: s.durationMinutes || undefined,
      image: s.image,
      featured: s.featured,
      enabled: s.enabled,
      href: s.href || "/services",
    }));
  } catch (error) {
    console.error("[getPublicFeaturedServices] DB fetch error:", error);
    return [];
  }
}

/**
 * Fetch active testimonials for Homepage
 */
export async function getPublicTestimonials(): Promise<TestimonialItem[]> {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: {
        enabled: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return dbTestimonials.map((t) => ({
      id: t.id,
      clientName: t.clientName,
      clientRoleOrLocation: t.clientRoleOrLocation || null,
      quote: t.quote || null,
      videoSrc: t.videoSrc || null,
      posterImage: t.posterImage || null,
      featured: t.featured,
      enabled: t.enabled,
    }));
  } catch (error) {
    console.error("[getPublicTestimonials] DB fetch error:", error);
    return [];
  }
}

