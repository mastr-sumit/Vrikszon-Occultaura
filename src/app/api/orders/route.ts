import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

/**
 * Generate human-readable order number: VO-YYYYMMDD-XXXX
 */
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `VO-${dateStr}-${randomSuffix}`;
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (Strict tier for Checkout & Order placement)
    const rateLimit = checkRouteRateLimit(request, "strict");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    // 2. Strict Input Validation (Type, Length, Format, Unknown fields rejection)
    const validation = await parseAndValidateJson(request, createOrderSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;
    const requestedItems = data.items;

    // Fetch product details from DB to calculate true server-side pricing
    const productIdentifiers = Array.from(
      new Set(requestedItems.map((i) => i.productId))
    );

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: productIdentifiers } },
          { slug: { in: productIdentifiers } },
        ],
      },
    });

    const productMap = new Map<string, (typeof products)[0]>();
    products.forEach((p) => {
      productMap.set(p.id, p);
      productMap.set(p.slug, p);
    });

    // Ensure all requested products exist in database and are active
    for (const item of requestedItems) {
      const prod = productMap.get(item.productId);
      if (!prod || !prod.enabled || prod.archived) {
        return NextResponse.json(
          { error: `Product "${item.productId}" is currently unavailable or invalid.` },
          { status: 400 }
        );
      }
    }

    // Calculate total price server-side (never trust client total)
    const totalPrice = requestedItems.reduce((acc, item) => {
      const prod = productMap.get(item.productId)!;
      const unitPrice = prod.price ?? 0;
      return acc + unitPrice * item.quantity;
    }, 0);

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    });
    while (existingOrder) {
      orderNumber = generateOrderNumber();
      existingOrder = await prisma.order.findUnique({
        where: { orderNumber },
      });
    }

    // Create Order and snapshot OrderItems in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        totalPrice,
        status: "PENDING",
        paymentStatus: "UNPAID",
        items: {
          create: requestedItems.map((item) => {
            const prod = productMap.get(item.productId)!;
            return {
              productId: prod.id, // Link to actual DB product ID
              quantity: item.quantity,
              price: prod.price ?? 0, // Snapshot price at time of order
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: order.id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServerError(
      error,
      "POST /api/orders",
      "Failed to process your order. Please try again or reach out to customer support."
    );
  }
}
