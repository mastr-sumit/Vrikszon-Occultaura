import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/services — Public active services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = {
      archived: false,
      enabled: true,
    };

    if (featuredOnly) {
      where.featured = true;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        shortDescription: true,
        longDescription: true,
        price: true,
        durationMinutes: true,
        image: true,
        featured: true,
        enabled: true,
        displayOrder: true,
        href: true,
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
