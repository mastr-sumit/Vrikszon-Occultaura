"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Gem, Sparkles, BookOpen, Triangle, ShoppingBag, Check, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { PRODUCTS, formatProductPrice, type Product, type ProductIcon } from "@/data/products";

import { AddToCartButton } from "@/components/shop/AddToCartButton";

/** Maps each product's stable icon key to its Lucide component — keeps products.ts free of any UI/React dependency. */
const ICONS: Record<ProductIcon, LucideIcon> = {
  gem: Gem,
  sparkles: Sparkles,
  book: BookOpen,
  triangle: Triangle,
};

interface ProductCardProps {
  product: Product;
  variants: any;
}

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const Icon = ICONS[product.icon];
  const imageSrc = product.image || `/images/products/${product.slug}.jpg`;

  return (
    <motion.div variants={variants} className="h-full">
      <Link
        href={product.href}
        className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      >
        <Card
          hover={false}
          padding="md"
          className={cn(
            "group flex h-full flex-col overflow-hidden p-0 cursor-pointer",
            "border-gold-500/30 bg-white text-text-primary",
            "transition-[transform,box-shadow,border-color] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:shadow-lg hover:border-gold-500/50 motion-safe:hover:-translate-y-2"
          )}
        >
          {/* Image container — renders Next.js Image if photo exists, else design-system placeholder */}
          <div
            aria-hidden="true"
            className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-gold-50)_0%,var(--color-warm-white)_100%)]"
          >
            {!imageError ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <>
                <span className="absolute h-24 w-24 rounded-full border border-navy-900/10" />
                <span className="absolute h-16 w-16 rounded-full border border-gold-500/30" />
                <Icon
                  className="relative h-8 w-8 text-gold-600 transition-transform duration-[250ms] ease-out motion-safe:group-hover:-translate-y-1"
                  strokeWidth={1.5}
                />
              </>
            )}

            {product.featured && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-navy-900 px-3 py-1 text-caption font-semibold uppercase tracking-[0.08em] text-white">
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4 p-6">
            <CardHeader className="mb-0">
              <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600">
                {product.category}
              </span>
              <CardTitle className="text-h5 transition-colors group-hover:text-gold-600">
                {product.name}
              </CardTitle>
            </CardHeader>

            <div className="mt-auto flex flex-col gap-4">
              <p className="font-heading text-h5 font-medium text-navy-900">
                {formatProductPrice(product.price)}
              </p>

              <CardFooter className="mt-0 flex-col items-stretch">
                <AddToCartButton product={product} />
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

/**
 * Products ("Featured Collection")
 *
 * Homepage shop preview for physical/spiritual products.
 * Static, boutique-style grid: 8 featured items in 4 columns across 2 rows.
 */
const Products = () => {
  const shouldReduceMotion = useReducedMotion();

  const activeProducts = PRODUCTS.filter((product) => product.enabled && product.featured);

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  };

  const cardVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  return (
    <section id="products" className="bg-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Featured Collection"
          heading="Discover Products Chosen with Intention"
          description="Every piece in this collection is selected to support balance, positive energy and mindful, everyday living."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8"
        >
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} variants={cardVariants} />
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Button
            href="/shop"
            size="lg"
            className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Products;