"use client";

import { useState } from "react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { CoursesTab } from "./tabs/CoursesTab";
import { BookingsTab, AdminBooking } from "./tabs/BookingsTab";
import { OrdersTab, AdminOrder } from "./tabs/OrdersTab";
import { MessagesTab, AdminMessage } from "./tabs/MessagesTab";
import { AdminProduct, ProductModal } from "./modals/ProductModal";
import { AdminCourse, CourseModal } from "./modals/CourseModal";

interface AdminDashboardClientProps {
  initialProducts: AdminProduct[];
  initialCourses: AdminCourse[];
  initialBookings: AdminBooking[];
  initialOrders: AdminOrder[];
  initialMessages: AdminMessage[];
  adminUser: {
    name: string;
    email: string;
  };
}

export function AdminDashboardClient({
  initialProducts,
  initialCourses,
  initialBookings,
  initialOrders,
  initialMessages,
  adminUser,
}: AdminDashboardClientProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [courses, setCourses] = useState<AdminCourse[]>(initialCourses);
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick modals from Overview
  const [isQuickProductModalOpen, setIsQuickProductModalOpen] = useState(false);
  const [isQuickCourseModalOpen, setIsQuickCourseModalOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [prodRes, courseRes, bookRes, orderRes, msgRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/messages"),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (courseRes.ok) setCourses(await courseRes.json());
      if (bookRes.ok) setBookings(await bookRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (error) {
      console.error("Failed to refresh admin data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const counts = {
    products: products.length,
    courses: courses.length,
    bookings: bookings.length,
    orders: orders.length,
    messages: messages.filter((m) => !m.isRead).length,
  };

  return (
    <div className="flex min-h-screen bg-navy-950 text-white selection:bg-gold-500 selection:text-navy-950">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        counts={counts}
        adminUser={adminUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <AdminHeader
          currentTab={currentTab}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          bookings={bookings}
          orders={orders}
          messages={messages}
          onNavigateTab={setCurrentTab}
        />

        {/* Tab Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentTab === "overview" && (
              <OverviewTab
                products={products}
                courses={courses}
                bookingsCount={bookings.length}
                ordersCount={orders.length}
                messagesCount={messages.length}
                onNavigateTab={setCurrentTab}
                onAddProduct={() => setIsQuickProductModalOpen(true)}
                onAddCourse={() => setIsQuickCourseModalOpen(true)}
              />
            )}

            {currentTab === "products" && (
              <ProductsTab
                products={products}
                onProductsUpdated={setProducts}
              />
            )}

            {currentTab === "courses" && (
              <CoursesTab
                courses={courses}
                onCoursesUpdated={setCourses}
              />
            )}

            {currentTab === "bookings" && (
              <BookingsTab
                bookings={bookings}
                onBookingsUpdated={setBookings}
              />
            )}

            {currentTab === "orders" && (
              <OrdersTab
                orders={orders}
                onOrdersUpdated={setOrders}
              />
            )}

            {currentTab === "messages" && (
              <MessagesTab
                messages={messages}
                onMessagesUpdated={setMessages}
              />
            )}
          </div>
        </main>
      </div>

      {/* Quick Add Product Modal from Overview */}
      <ProductModal
        isOpen={isQuickProductModalOpen}
        product={null}
        onClose={() => setIsQuickProductModalOpen(false)}
        onSaved={(newProd) => setProducts((prev) => [newProd, ...prev])}
      />

      {/* Quick Add Course Modal from Overview */}
      <CourseModal
        isOpen={isQuickCourseModalOpen}
        course={null}
        onClose={() => setIsQuickCourseModalOpen(false)}
        onSaved={(newCourse) => setCourses((prev) => [newCourse, ...prev])}
      />
    </div>
  );
}
