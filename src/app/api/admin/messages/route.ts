import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createContactMessageSchema, updateContactMessageSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/messages — List all contact messages ordered by createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/messages", "Failed to fetch messages.");
  }
}

/**
 * POST /api/admin/messages — Create a new contact message (also used by public contact form)
 */
export async function POST(request: Request) {
  try {
    // 1. Rate limiting check (public form submission)
    const rateLimit = checkRouteRateLimit(request, "public");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    // 2. Strict validation
    const validation = await parseAndValidateJson(request, createContactMessageSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        reason: data.reason,
        message: data.message,
        isRead: false,
      },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/messages", "Failed to send your message. Please try again.");
  }
}

/**
 * PATCH /api/admin/messages — Mark message as read/unread by id
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(request, updateContactMessageSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const existing = await prisma.contactMessage.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: data.id },
      data: {
        isRead: data.isRead,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/messages", "Failed to update message status.");
  }
}
