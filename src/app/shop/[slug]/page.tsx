import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/ui";
import { ProductGallery, ProductInfoPanel, RelatedProductsSection } from "@/components/shop";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found - Affordable Wigs Gh",
    };
  }

  return {
    title: `${product.name} - Affordable Wigs Gh`,
    description: product.shortDescription || product.description?.slice(0, 160) || "Shop premium wigs at Affordable Wigs Gh.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Safely get category info - category could be an ObjectId or a populated object
  const categorySlug = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any).slug 
    : '';
  const categoryName = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any).name 
    : '';
  const categoryId = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any)._id?.toString() 
    : String(product.category);

  // Fetch related products from the same category
  const relatedProducts = await getRelatedProducts(
    product._id.toString(),
    categoryId,
    4
  );

  return (
    <main>
      {/* Breadcrumb */}
      <Section background="cream" padding="sm">
        <Container>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-brand-gray hover:text-brand-gold transition-colors">
              Home
            </Link>
            <span className="text-brand-taupe">/</span>
            <Link href="/shop" className="text-brand-gray hover:text-brand-gold transition-colors">
              Shop
            </Link>
            {categoryName && (
              <>
                <span className="text-brand-taupe">/</span>
                <Link
                  href={`/shop?category=${categorySlug}`}
                  className="text-brand-gray hover:text-brand-gold transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span className="text-brand-taupe">/</span>
            <span className="text-brand-black truncate max-w-xs">{product.name}</span>
          </nav>
        </Container>
      </Section>

      {/* Product Detail */}
      <Section background="white" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <div className="order-1">
              <ProductGallery
                mainImage={product.mainImage}
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Product Info Panel */}
            <div className="order-2">
              <ProductInfoPanel product={product as any} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Products */}
      <RelatedProductsSection products={relatedProducts as any} />
    </main>
  );
}
