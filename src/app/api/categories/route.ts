import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/categories?type=PRODUCT|COURSE|SERVICE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const validTypes = ["PRODUCT", "COURSE", "SERVICE"] as const;
    const isMatchingType = type && (validTypes as readonly string[]).includes(type);

    const categories = await prisma.category.findMany({
      where: isMatchingType ? { type: type as (typeof validTypes)[number] } : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            courses: { where: { enabled: true } },
            products: { where: { enabled: true, archived: false } },
            services: { where: { enabled: true, archived: false } },
          },
        },
      },
    });

    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type,
      count:
        c.type === "COURSE"
          ? c._count.courses
          : c.type === "PRODUCT"
          ? c._count.products
          : c._count.services,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
