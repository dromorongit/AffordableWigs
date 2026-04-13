import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: unknown[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product: any) => {
        const id = product._id?.toString() || String(product._id) || Math.random().toString();
        return <ProductCard key={id} product={product} />;
      })}
    </div>
  );
}

export default ProductGrid;
