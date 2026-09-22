import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * Public Order Details Retrieval API
 *
 * GET /api/orders/details?orderNumber=VO-20260903-3879
 *
 * Used by OrderConfirmation / Checkout page to fetch real order, items,
 * and shipping details from the database upon page refresh or payment redirect.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const orderId = searchParams.get("orderId");

    const lookupKey = orderNumber || orderId;

    if (!lookupKey) {
      return NextResponse.json(
        { success: false, error: "Missing required 'orderNumber' or 'orderId' parameter." },
        { status: 400 }
      );
    }

    // Try finding by orderNumber first, fallback to id, then razorpayOrderId
    let order = await prisma.order.findUnique({
      where: { orderNumber: lookupKey },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: lookupKey },
            { razorpayOrderId: lookupKey },
          ],
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
      });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const structuredItems = order.items.map((item) => {
      let productImg: string | null = null;
      if (item.product) {
        if (item.product.image) {
          productImg = item.product.image;
        } else if (item.product.slug) {
          productImg = `/images/products/${item.product.slug}.jpg`;
        }
      }

      return {
        product: {
          id: item.product?.id || item.productId,
          slug: item.product?.slug || "sacred-item",
          name: item.product?.name || "Sacred Item",
          category: item.product?.category || "Spiritual",
          shortDescription: item.product?.shortDescription || "",
          price: item.price,
          image: productImg,
          icon: "gem" as const,
          featured: false,
          enabled: true,
          href: item.product?.slug ? `/shop/${item.product.slug}` : "/shop",
        },
        quantity: item.quantity,
      };
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        fullName: order.fullName,
        email: order.email,
        phone: order.phone,
        addressLine1: order.addressLine1,
        addressLine2: order.addressLine2,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: structuredItems,
      },
    });
  } catch (error) {
    return handleServerError(error, "GET /api/orders/details", "Failed to retrieve order details.");
  }
}
