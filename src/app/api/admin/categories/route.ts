import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

// GET /api/admin/categories?type=PRODUCT|COURSE
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: any = {};
    if (type === "PRODUCT" || type === "COURSE" || type === "SERVICE") {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: true,
            courses: true,
            services: true,
          },
        },
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      productCount: cat._count.products,
      courseCount: cat._count.courses,
      serviceCount: cat._count.services,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name?.trim();
    const type = body.type === "COURSE" ? "COURSE" : "PRODUCT";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = type === "COURSE" ? `course-${slugify(name)}` : slugify(name);
    if (!baseSlug) baseSlug = `category-${Date.now()}`;
    
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        type,
      },
      include: {
        _count: {
          select: { products: true, courses: true },
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/courses");

    return NextResponse.json(
      {
        id: category.id,
        name: category.name,
        slug: category.slug,
        type: category.type,
        productCount: category._count.products,
        courseCount: category._count.courses,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
