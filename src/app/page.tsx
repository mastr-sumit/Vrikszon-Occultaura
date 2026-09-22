import type { Metadata } from "next";
import { homepageSections } from "@/data/homepageSections";
import { getPublicFeaturedProducts, getPublicTestimonials } from "@/lib/db-public";
import Products from "@/components/sections/Products";
import Testimonials from "@/components/sections/Testimonials";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Vrikszon Occultaura | Numbers Change • Energy Transforms • Life Elevates",
  description:
    "Premium Numerology & Vastu guidance with Vrikszon Occultaura. Numbers Change • Energy Transforms • Life Elevates through personalized consultation.",
};

/**
 * Homepage
 *
 * Server Component with live DB data fetching — guarantees immediate
 * reflection of Admin Panel updates for Products and Testimonials.
 */
export default async function HomePage() {
  const [featuredProducts, testimonials] = await Promise.all([
    getPublicFeaturedProducts(),
    getPublicTestimonials(),
  ]);

  return (
    <main>
      {homepageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => {
          if (id === "products") {
            return <Products key={id} initialProducts={featuredProducts} />;
          }
          if (id === "testimonials") {
            return <Testimonials key={id} initialTestimonials={testimonials} />;
          }
          return <Section key={id} />;
        })}
    </main>
  );
}