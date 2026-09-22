import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProductSchema, resourceIdSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson, validateInput } from "@/lib/validations/validator";
import { formatProduct } from "../route";
import { handleServerError } from "@/lib/errors";

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
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const product = await prisma.product.findUnique({
      where: { id: idValidation.data },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(formatProduct(product));
  } catch (error) {
    return handleServerError(error, "GET /api/admin/products/[id]", "Failed to fetch product.");
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
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const validation = await parseAndValidateJson(request, updateProductSchema);
    if (!validation.success) {
      return validation.response;
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

    // Link or auto-create Category record if category changed
    let categoryId: string | undefined = undefined;
    if (data.category !== undefined) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: data.category.trim(), mode: "insensitive" }, type: "PRODUCT" },
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    const t0 = Date.now();
    const updated = await prisma.product.update({
      where: { id: idValidation.data },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.category !== undefined && { category: data.category }),
        ...(categoryId !== undefined && { categoryId }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(benefitsString !== undefined && { benefits: benefitsString }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
        ...(data.archived !== undefined && { archived: data.archived }),
        ...(data.href !== undefined && { href: data.href }),
        ...(data.variantsNote !== undefined && { variantsNote: data.variantsNote }),
      },
    });
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/shop");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Product Update (${updated.name}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json(formatProduct(updated));
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/products/[id]", "Failed to update product.");
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
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const t0 = Date.now();
    await prisma.product.delete({
      where: { id: idValidation.data },
    });
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/shop");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Product Delete (${existingProduct.name}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json({
      success: true,
      message: `Product "${existingProduct.name}" deleted successfully`,
    });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/products/[id]", "Failed to delete product.");
  }
}
