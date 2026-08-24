import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateOrderSchema, resourceIdSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson, validateInput } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/orders/[id] — Get single order by id with items
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

    const order = await prisma.order.findUnique({
      where: { id: idValidation.data },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/orders/[id]", "Failed to fetch order.");
  }
}

/**
 * PATCH /api/admin/orders/[id] — Update order status / payment status
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

    const existingOrder = await prisma.order.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const validation = await parseAndValidateJson(request, updateOrderSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const updated = await prisma.order.update({
      where: { id: idValidation.data },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.paymentStatus !== undefined && { paymentStatus: data.paymentStatus }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/orders/[id]", "Failed to update order status.");
  }
}

/**
 * DELETE /api/admin/orders/[id] — Delete order by id
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

    const existingOrder = await prisma.order.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({
      where: { id: idValidation.data },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${existingOrder.orderNumber} deleted successfully`,
    });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/orders/[id]", "Failed to delete order.");
  }
}
