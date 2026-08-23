"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { FloatingConsultationBar } from "@/components/layout/FloatingConsultationBar";

/**
 * AppShell
 *
 * Conditionally renders public website navigation (Navbar, Footer, CartDrawer,
 * FloatingConsultationBar) for regular customer-facing pages, while suppressing
 * them for internal admin portal routes (/admin/*).
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <FloatingConsultationBar />
    </>
  );
}
