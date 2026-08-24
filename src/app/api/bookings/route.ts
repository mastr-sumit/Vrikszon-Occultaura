import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

/**
 * POST /api/bookings — Public endpoint to create a consultation booking request
 */
export async function POST(request: Request) {
  try {
    // 1. Rate limiting check (public form submission tier)
    const rateLimit = checkRouteRateLimit(request, "public");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    // 2. Strict Zod Schema Validation (rejection of invalid dates, types, formats)
    const validation = await parseAndValidateJson(request, createBookingSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    // 3. Date Parsing
    let preferredDate: Date | null = null;
    if (data.preferredDate) {
      const parsed = new Date(data.preferredDate);
      if (!isNaN(parsed.getTime())) {
        preferredDate = parsed;
      }
    }

    // 4. Combine birth details with user queries for comprehensive admin review
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

    // 5. Save to database
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

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          name: booking.name,
          service: booking.service,
          status: booking.status,
          createdAt: booking.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServerError(error, "POST /api/bookings", "Failed to submit booking request.");
  }
}
