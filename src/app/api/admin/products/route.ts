import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

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
    return handleServerError(error, "GET /api/admin/products", "Failed to fetch products.");
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

    const validation = await parseAndValidateJson(request, createProductSchema);
    if (!validation.success) {
      return validation.response;
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

    // Link or auto-create Category record
    let categoryId: string | null = null;
    if (data.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: data.category.trim(), mode: "insensitive" }, type: "PRODUCT" },
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    const t0 = Date.now();
    const product = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        category: data.category,
        categoryId,
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
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/shop");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Product Create (${product.name}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json(formatProduct(product), { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/products", "Failed to create product.");
  }
}
