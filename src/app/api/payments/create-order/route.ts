import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

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
    const rateLimit = checkRouteRateLimit(request, "strict");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { type } = body;

    const razorpay = getRazorpayInstance();
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

    // ─────────────────────────────────────────────
    // 1. SHOP CART CHECKOUT
    // ─────────────────────────────────────────────
    if (type === "SHOP_ORDER") {
      const { shippingData, items } = body;

      if (!shippingData || !items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: "Invalid order data. Cart items and shipping details are required." },
          { status: 400 }
        );
      }

      const productIds = Array.from(new Set(items.map((i: { productId: string }) => i.productId)));
      const products = await prisma.product.findMany({
        where: {
          OR: [{ id: { in: productIds } }, { slug: { in: productIds } }],
        },
      });

      const productMap = new Map<string, (typeof products)[0]>();
      products.forEach((p) => {
        productMap.set(p.id, p);
        productMap.set(p.slug, p);
      });

      for (const item of items) {
        const prod = productMap.get(item.productId);
        if (!prod || !prod.enabled || prod.archived) {
          return NextResponse.json(
            { error: `Product "${item.productId}" is currently unavailable or invalid.` },
            { status: 400 }
          );
        }
      }

      // Server-side total calculation in Rupees
      const totalPriceRupees = items.reduce((acc: number, item: { productId: string; quantity: number }) => {
        const prod = productMap.get(item.productId)!;
        const unitPrice = prod.price ?? 0;
        return acc + unitPrice * item.quantity;
      }, 0);

      if (totalPriceRupees <= 0) {
        return NextResponse.json(
          { error: "Total order amount must be greater than zero." },
          { status: 400 }
        );
      }

      const amountInPaise = totalPriceRupees * 100;

      let orderNumber = generateOrderNumber();
      let existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
      while (existingOrder) {
        orderNumber = generateOrderNumber();
        existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
      }

      // Create Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderNumber,
          customerEmail: shippingData.email,
          customerPhone: shippingData.phone,
          orderType: "SHOP_ORDER",
        },
      });

      // Create Order in DB
      const order = await prisma.order.create({
        data: {
          orderNumber,
          fullName: shippingData.fullName,
          email: shippingData.email,
          phone: shippingData.phone,
          addressLine1: shippingData.addressLine1,
          addressLine2: shippingData.addressLine2 || null,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
          totalPrice: totalPriceRupees,
          status: "PENDING",
          paymentStatus: "UNPAID",
          razorpayOrderId: rzpOrder.id,
          items: {
            create: items.map((item: { productId: string; quantity: number }) => {
              const prod = productMap.get(item.productId)!;
              return {
                productId: prod.id,
                quantity: item.quantity,
                price: prod.price ?? 0,
              };
            }),
          },
        },
      });

      // Record Payment in DB
      await prisma.payment.create({
        data: {
          razorpayOrderId: rzpOrder.id,
          amount: amountInPaise,
          currency: "INR",
          status: "CREATED",
          type: "SHOP_ORDER",
          customerName: shippingData.fullName,
          customerEmail: shippingData.email,
          customerPhone: shippingData.phone,
          orderId: order.id,
          metadata: JSON.stringify({ orderNumber, itemsCount: items.length }),
        },
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId,
        orderNumber,
        internalId: order.id,
      });
    }

    // ─────────────────────────────────────────────
    // 2. CONSULTATION BOOKING
    // ─────────────────────────────────────────────
    if (type === "CONSULTATION_BOOKING") {
      const { bookingData } = body;

      if (!bookingData || !bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.service) {
        return NextResponse.json(
          { error: "Incomplete consultation booking details." },
          { status: 400 }
        );
      }

      // Fetch service price from DB or default consultation fee
      const service = await prisma.service.findFirst({
        where: {
          OR: [{ id: bookingData.service }, { slug: bookingData.service }, { name: bookingData.service }],
        },
      });

      const feeInRupees = service?.price && service.price > 0 ? service.price : 1100;
      const amountInPaise = feeInRupees * 100;

      let preferredDate: Date | null = null;
      if (bookingData.preferredDate) {
        const parsed = new Date(bookingData.preferredDate);
        if (!isNaN(parsed.getTime())) preferredDate = parsed;
      }

      const birthDetails = [
        bookingData.dob ? `DOB: ${bookingData.dob}` : null,
        bookingData.tob ? `TOB: ${bookingData.tob}` : null,
        bookingData.pob ? `POB: ${bookingData.pob}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const combinedMessage = [
        birthDetails ? `[Birth Details: ${birthDetails}]` : null,
        bookingData.message?.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      // Create Booking in DB
      const booking = await prisma.booking.create({
        data: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          service: service?.name || bookingData.service,
          amount: feeInRupees,
          preferredDate,
          message: combinedMessage || null,
          status: "PENDING",
          paymentStatus: "UNPAID",
        },
      });

      const receipt = `BK-${booking.id.slice(-8).toUpperCase()}`;

      // Create Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          bookingId: booking.id,
          service: service?.name || bookingData.service,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          orderType: "CONSULTATION_BOOKING",
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { razorpayOrderId: rzpOrder.id },
      });

      await prisma.payment.create({
        data: {
          razorpayOrderId: rzpOrder.id,
          amount: amountInPaise,
          currency: "INR",
          status: "CREATED",
          type: "CONSULTATION_BOOKING",
          customerName: bookingData.name,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          bookingId: booking.id,
          metadata: JSON.stringify({ service: service?.name || bookingData.service, preferredDate }),
        },
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId,
        bookingId: booking.id,
        serviceName: service?.name || bookingData.service,
      });
    }

    // ─────────────────────────────────────────────
    // 3. COURSE PURCHASE / ENROLLMENT
    // ─────────────────────────────────────────────
    if (type === "COURSE_PURCHASE") {
      const { courseId, courseSlug, studentData } = body;

      if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
        return NextResponse.json(
          { error: "Student contact information (name, email, phone) is required." },
          { status: 400 }
        );
      }

      const course = await prisma.course.findFirst({
        where: {
          OR: [
            ...(courseId ? [{ id: courseId }] : []),
            ...(courseSlug ? [{ slug: courseSlug }] : []),
          ],
        },
      });

      if (!course || !course.enabled) {
        return NextResponse.json(
          { error: "Selected course is currently unavailable or inactive." },
          { status: 404 }
        );
      }

      const priceInRupees = course.price && course.price > 0 ? course.price : 2100;
      const amountInPaise = priceInRupees * 100;

      const receipt = `CR-${course.slug.slice(0, 8)}-${Date.now().toString().slice(-4)}`;

      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
          customerEmail: studentData.email,
          customerPhone: studentData.phone,
          orderType: "COURSE_PURCHASE",
        },
      });

      await prisma.payment.create({
        data: {
          razorpayOrderId: rzpOrder.id,
          amount: amountInPaise,
          currency: "INR",
          status: "CREATED",
          type: "COURSE_PURCHASE",
          customerName: studentData.name,
          customerEmail: studentData.email,
          customerPhone: studentData.phone,
          courseId: course.id,
          metadata: JSON.stringify({ courseTitle: course.title, courseSlug: course.slug }),
        },
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId,
        courseTitle: course.title,
      });
    }

    return NextResponse.json(
      { error: "Invalid payment type. Must be SHOP_ORDER, CONSULTATION_BOOKING, or COURSE_PURCHASE." },
      { status: 400 }
    );
  } catch (error) {
    return handleServerError(error, "POST /api/payments/create-order", "Failed to initiate payment order.");
  }
}
