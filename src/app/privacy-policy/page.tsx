import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Vrikszon Occult Aura",
  description: "Privacy Policy and data collection guidelines for Vrikszon Occult Aura.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-warm-white py-16 md:py-24 pt-32 md:pt-40">
      <Container size="default">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 text-gold-600 mb-4">
            <Shield className="h-8 w-8" />
            <span className="text-small font-semibold uppercase tracking-wider">Legal Document</span>
          </div>

          <h1 className="font-heading text-h2 font-medium text-navy-900 mb-6">
            Privacy Policy
          </h1>

          <p className="text-body-lg text-text-secondary mb-8 pb-8 border-b border-border">
            Last updated: July 2026. At Vrikszon Occult Aura, we are committed to respecting and protecting your privacy while offering personalized Numerology and Vastu consultation services.
          </p>

          <div className="flex flex-col gap-8 text-text-secondary leading-relaxed">
            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 font-medium text-navy-900">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly when booking a consultation or contacting us, such as your full name, email address, phone number, date of birth, and place of birth (required for accurate numerological calculations).
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 font-medium text-navy-900">
                2. How We Use Your Information
              </h2>
              <p>
                Your information is used solely to generate personalized numerological predictions, prepare Vastu consultations, process inquiries, and communicate directly with you regarding your sessions and orders.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 font-medium text-navy-900">
                3. Data Confidentiality & Security
              </h2>
              <p>
                All personal details and chart calculations remain strictly confidential. We do not sell, rent, or trade your personal information to third parties. We implement standard technical safeguards to protect your personal data.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 font-medium text-navy-900">
                4. Cookies & Analytics
              </h2>
              <p>
                Our website uses basic operational cookies to optimize site browsing and understand user traffic. No sensitive personal data is stored within these cookies.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 font-medium text-navy-900">
                5. Your Rights & Contact Us
              </h2>
              <p>
                You have the right to request access to or deletion of your personal data at any time. For any privacy-related questions, please contact us via our{" "}
                <Link href="/contact" className="text-gold-600 underline font-medium hover:text-gold-700">
                  Contact Page
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}