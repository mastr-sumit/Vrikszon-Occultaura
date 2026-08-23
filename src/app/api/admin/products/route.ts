import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/admin";

/**
 * Helper to parse product benefits JSON string into array
 */
export function formatProduct(product: {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  subtitle: string | null;
  benefits: string | null;
  price: number | null;
  image: string | null;
  icon: string;
  featured: boolean;
  enabled: boolean;
  href: string | null;
  variantsNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  let parsedBenefits: string[] = [];
  if (product.benefits) {
    try {
      const parsed = JSON.parse(product.benefits);
      parsedBenefits = Array.isArray(parsed) ? parsed : [product.benefits];
    } catch {
      parsedBenefits = [product.benefits];
    }
  }

  return {
    ...product,
    benefits: parsedBenefits,
  };
}

/**
 * GET /api/admin/products — List all products ordered by createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products.map(formatProduct));
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products — Create a new product
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const validation = createProductSchema.safeParse(json);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Product slug "${data.slug}" is already in use` },
        { status: 409 }
      );
    }

    // Format benefits as JSON string
    const benefitsString = data.benefits
      ? Array.isArray(data.benefits)
        ? JSON.stringify(data.benefits)
        : JSON.stringify([data.benefits])
      : null;

    const product = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        category: data.category,
        shortDescription: data.shortDescription,
        subtitle: data.subtitle ?? null,
        benefits: benefitsString,
        price: data.price ?? null,
        image: data.image ?? null,
        icon: data.icon ?? "sparkles",
        featured: data.featured ?? false,
        enabled: data.enabled ?? true,
        href: data.href ?? "/shop",
        variantsNote: data.variantsNote ?? null,
      },
    });

    return NextResponse.json(formatProduct(product), { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
