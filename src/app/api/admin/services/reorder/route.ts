import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

// POST /api/admin/services/reorder
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body; // Array of { id: string, displayOrder: number }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.service.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json({ success: true, count: items.length });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/services/reorder", "Failed to reorder services.");
  }
}
