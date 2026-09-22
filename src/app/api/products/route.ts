import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, type Product, type ProductIcon } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/products — Public endpoint to fetch all active shop & featured products
 */
export async function GET() {
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

    const formatted: Product[] = dbProducts.map((p) => {
      let benefits: string[] | undefined = undefined;
      if (p.benefits) {
        try {
          const parsed = JSON.parse(p.benefits);
          if (Array.isArray(parsed)) benefits = parsed;
        } catch {
          benefits = [p.benefits];
        }
      }

      const validIcon: ProductIcon = ["gem", "book", "triangle", "sparkles"].includes(p.icon as ProductIcon)
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
    });

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("[PUBLIC_PRODUCTS_GET_ERROR]", error);
    return NextResponse.json([], {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }
}
