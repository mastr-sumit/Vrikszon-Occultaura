import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { formatProduct } from "@/app/api/admin/products/route";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Load all initial datasets directly from SQLite database for fast SSR
  const [rawProducts, courses, testimonials, bookings, orders, messages] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const products = rawProducts.map(formatProduct);

  const adminUser = {
    name: session.user.name || "Admin",
    email: session.user.email || "admin@vrikszon.com",
  };

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialCourses={courses}
      initialTestimonials={testimonials}
      initialBookings={bookings}
      initialOrders={orders}
      initialMessages={messages}
      adminUser={adminUser}
    />
  );
}
