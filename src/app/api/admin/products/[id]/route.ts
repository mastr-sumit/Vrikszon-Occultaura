import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validations/admin";
import { formatProduct } from "../route";

/**
 * GET /api/admin/products/[id] — Get single product by id
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(formatProduct(product));
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/products/[id] — Update product by id
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const validation = updateProductSchema.safeParse(json);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = validation.data;

    // Check slug uniqueness if slug is being updated
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: `Product slug "${data.slug}" is already in use` },
          { status: 409 }
        );
      }
    }

    // Format benefits if provided
    let benefitsString: string | null | undefined = undefined;
    if (data.benefits !== undefined) {
      benefitsString = data.benefits
        ? Array.isArray(data.benefits)
          ? JSON.stringify(data.benefits)
          : JSON.stringify([data.benefits])
        : null;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(benefitsString !== undefined && { benefits: benefitsString }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
        ...(data.href !== undefined && { href: data.href }),
        ...(data.variantsNote !== undefined && { variantsNote: data.variantsNote }),
      },
    });

    return NextResponse.json(formatProduct(updated));
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id] — Delete product by id
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: `Product "${existingProduct.name}" deleted successfully` });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
