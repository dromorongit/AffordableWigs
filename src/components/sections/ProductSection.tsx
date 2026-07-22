import Link from "next/link";
import { Container, Section, Button } from "@/components/ui";
import { ProductGrid } from "@/components/shop";

interface ProductSectionProps {
  subtitle: string;
  title: string;
  products: unknown[];
  viewAllHref?: string;
}

export function ProductSection({
  subtitle,
  title,
  products,
  viewAllHref = "/shop",
}: ProductSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Section background="cream" padding="lg">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
              {subtitle}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
              {title}
            </h2>
          </div>
          <Link href={viewAllHref}>
            <Button variant="outline" size="md">
              View All Products
            </Button>
          </Link>
        </div>
        <ProductGrid products={products} />
        <div className="mt-8 md:hidden">
          <Link href={viewAllHref}>
            <Button variant="primary" size="md" className="w-full">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default ProductSection;
