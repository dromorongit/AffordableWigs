import { IProductPopulated } from "@/types/product";
import { ProductGrid } from "./ProductGrid";
import { Container, Section } from "@/components/ui";

interface RelatedProductsSectionProps {
  products: IProductPopulated[];
}

export function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Section background="cream" padding="lg">
      <Container>
        <h2 className="font-heading text-2xl md:text-3xl text-brand-black mb-8">
          You May Also Like
        </h2>
        <ProductGrid products={products} />
      </Container>
    </Section>
  );
}

export default RelatedProductsSection;
