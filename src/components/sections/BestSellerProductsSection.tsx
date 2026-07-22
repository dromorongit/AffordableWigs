import { getBestSellerProducts } from "@/lib/products";
import { ProductSection } from "./ProductSection";

export const revalidate = 60;

export async function BestSellerProductsSection() {
  const products = await getBestSellerProducts(8);

  return (
    <ProductSection
      subtitle="Best Sellers"
      title="Top Selling Wigs"
      products={products}
    />
  );
}

export default BestSellerProductsSection;
