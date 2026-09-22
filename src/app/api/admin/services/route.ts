import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * GET /api/admin/services — List all services ordered by displayOrder asc, createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        categoryRel: true,
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/services", "Failed to fetch services.");
  }
}

/**
 * POST /api/admin/services — Create a new service
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name?.trim();
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Service name must be at least 2 characters" }, { status: 400 });
    }

    let slug = body.slug?.trim() || slugify(name);
    if (!slug) slug = `service-${Date.now()}`;

    // Ensure unique slug
    let baseSlug = slug;
    let counter = 1;
    while (await prisma.service.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Auto-link or find Category record
    const categoryName = body.category?.trim() || "Numerology";
    let categoryId: string | null = null;
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: "insensitive" }, type: "SERVICE" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: `service-${slugify(categoryName)}`,
          type: "SERVICE",
        },
      });
    }
    categoryId = category.id;

    // Get max displayOrder to append at the end
    const lastService = await prisma.service.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (lastService?.displayOrder ?? -1) + 1;

    const service = await prisma.service.create({
      data: {
        slug,
        name,
        category: categoryName,
        categoryId,
        shortDescription: body.shortDescription?.trim() || "",
        longDescription: body.longDescription?.trim() || null,
        price: body.price !== null && body.price !== undefined && body.price !== "" ? Number(body.price) : null,
        durationMinutes: body.durationMinutes !== null && body.durationMinutes !== undefined && body.durationMinutes !== "" ? Number(body.durationMinutes) : null,
        image: body.image || null,
        featured: !!body.featured,
        enabled: body.enabled !== undefined ? !!body.enabled : true,
        archived: !!body.archived,
        displayOrder: nextOrder,
        href: body.href?.trim() || "/services",
      },
      include: {
        categoryRel: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/services", "Failed to create service.");
  }
}
