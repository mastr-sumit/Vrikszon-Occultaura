import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createContactMessageSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

/**
 * POST /api/contact — Public endpoint to submit a contact inquiry / message
 */
export async function POST(request: Request) {
  try {
    // 1. Rate limiting check (public form submission tier)
    const rateLimit = checkRouteRateLimit(request, "public");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    // 2. Strict Zod Schema Validation
    const validation = await parseAndValidateJson(request, createContactMessageSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    // 3. Format birth details into the stored message if provided
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

    // 4. Save into ContactMessage table
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        reason: data.reason,
        message: combinedMessage || data.message,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: {
          id: contactMessage.id,
          name: contactMessage.name,
          email: contactMessage.email,
          reason: contactMessage.reason,
          createdAt: contactMessage.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServerError(error, "POST /api/contact", "Failed to send your message. Please try again.");
  }
}
