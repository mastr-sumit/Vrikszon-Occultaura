import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().positive("Quantity must be a positive integer"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

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
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const validation = createOrderSchema.safeParse(json);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
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

    // Ensure all requested products exist in database
    for (const item of requestedItems) {
      if (!productMap.has(item.productId)) {
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
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        addressLine1: data.addressLine1.trim(),
        addressLine2: data.addressLine2?.trim() || null,
        city: data.city.trim(),
        state: data.state.trim(),
        pincode: data.pincode.trim(),
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
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again or contact support." },
      { status: 500 }
    );
  }
}
