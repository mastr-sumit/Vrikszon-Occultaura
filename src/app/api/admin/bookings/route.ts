import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema, updateBookingSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/bookings — List all consultation bookings ordered by createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/bookings", "Failed to fetch bookings.");
  }
}

/**
 * POST /api/admin/bookings — Create a new consultation booking (also used by public form)
 */
export async function POST(request: Request) {
  try {
    // 1. Rate limiting check (public form submission)
    const rateLimit = checkRouteRateLimit(request, "public");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    // 2. Strict validation
    const validation = await parseAndValidateJson(request, createBookingSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    let preferredDate: Date | null = null;
    if (data.preferredDate) {
      const parsed = new Date(data.preferredDate);
      if (!isNaN(parsed.getTime())) {
        preferredDate = parsed;
      }
    }

    const birthDetails = [
      data.dob ? `DOB: ${data.dob}` : null,
      data.tob ? `TOB: ${data.tob}` : null,
      data.pob ? `POB: ${data.pob}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const combinedMessage = [
      birthDetails ? `[Birth Details: ${birthDetails}]` : null,
      data.message?.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        preferredDate,
        message: combinedMessage || data.message || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/bookings", "Failed to submit booking request.");
  }
}

/**
 * PATCH /api/admin/bookings — Update booking status or archived state by id
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(request, updateBookingSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: data.id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id: data.id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.archived !== undefined && { archived: data.archived }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/bookings", "Failed to update booking.");
  }
}

/**
 * DELETE /api/admin/bookings — Permanently delete booking by id
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Booking for ${existingBooking.name} deleted successfully`,
    });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/bookings", "Failed to delete booking.");
  }
}

