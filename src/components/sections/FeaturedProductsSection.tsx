import { getFeaturedProducts } from "@/lib/products";
import { ProductSection } from "./ProductSection";

export const revalidate = 60;

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(8);

  return (
    <ProductSection
      subtitle="Featured Collections"
      title="Our Popular Wigs"
      products={products}
    />
  );
}

export default FeaturedProductsSection;
