import Link from "next/link";
import { BRAND } from "@/constants";
import { Container, Section, Button } from "@/components/ui";
import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop";

// Revalidate every 60 seconds to ensure fresh featured products
export const revalidate = 60;

export async function FeaturedProductsSection() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <Section background="cream" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
              Featured
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
              Our Popular Wigs
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" size="md">
              View All Products
            </Button>
          </Link>
        </div>

        {/* Products Grid - 2 columns on mobile, 4 on desktop */}
        <ProductGrid products={featuredProducts} />

        {/* Mobile View All CTA */}
        <div className="mt-8 md:hidden">
          <Link href="/shop">
            <Button variant="primary" size="md" className="w-full">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default FeaturedProductsSection;
