import type { Metadata } from "next";
import { shopPageSections } from "@/data/shopPageSections";
import { getPublicProducts } from "@/lib/db-public";
import ShopGrid from "@/components/shop/ShopGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Shop | Vrikszon Occultaura",
  description:
    "Explore our collection of sacred crystals, Rudraksha malas, healing bracelets, and Vastu tools energised to support your spiritual journey and personal balance.",
};

/**
 * Shop Page
 *
 * Server Component with live DB data fetching — guarantees immediate
 * reflection of Admin Panel updates for Products.
 */
export default async function ShopPage() {
  const products = await getPublicProducts();

  return (
    <main>
      {shopPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => {
          if (id === "shop-grid") {
            return <ShopGrid key={id} initialProducts={products} />;
          }
          return <Section key={id} />;
        })}
    </main>
  );
}

