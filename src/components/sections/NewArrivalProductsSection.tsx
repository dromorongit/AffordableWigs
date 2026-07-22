import { getNewArrivalProducts } from "@/lib/products";
import { ProductSection } from "./ProductSection";

export const revalidate = 60;

export async function NewArrivalProductsSection() {
  const products = await getNewArrivalProducts(8);

  return (
    <ProductSection
      subtitle="New Arrivals"
      title="Just In"
      products={products}
    />
  );
}

export default NewArrivalProductsSection;
