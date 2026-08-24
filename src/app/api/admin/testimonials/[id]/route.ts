import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTestimonialSchema, resourceIdSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson, validateInput } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/testimonials/[id] — Get single testimonial by id
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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: idValidation.data },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/testimonials/[id]", "Failed to fetch testimonial.");
  }
}

/**
 * PATCH /api/admin/testimonials/[id] — Update testimonial by id
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

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const validation = await parseAndValidateJson(request, updateTestimonialSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const updated = await prisma.testimonial.update({
      where: { id: idValidation.data },
      data: {
        ...(data.clientName !== undefined && { clientName: data.clientName }),
        ...(data.clientRoleOrLocation !== undefined && { clientRoleOrLocation: data.clientRoleOrLocation }),
        ...(data.quote !== undefined && { quote: data.quote }),
        ...(data.videoSrc !== undefined && { videoSrc: data.videoSrc }),
        ...(data.posterImage !== undefined && { posterImage: data.posterImage }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/testimonials/[id]", "Failed to update testimonial.");
  }
}

/**
 * DELETE /api/admin/testimonials/[id] — Delete testimonial by id
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

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id: idValidation.data },
    });

    return NextResponse.json({
      success: true,
      message: `Testimonial for "${existingTestimonial.clientName}" deleted successfully`,
    });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/testimonials/[id]", "Failed to delete testimonial.");
  }
}
