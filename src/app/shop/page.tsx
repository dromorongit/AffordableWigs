import { Metadata } from "next";
import { Suspense } from "react";
import { Header, Footer } from "@/components/layout";
import { Container, Section } from "@/components/ui";
import { ShopHero, FilterBar, ProductGrid, EmptyState } from "@/components/shop";
import { getProducts, getCategories, getProductsCount } from "@/lib/products";
import { PAGE_METADATA } from "@/constants";

// Revalidate every 60 seconds to ensure fresh product data
export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: PAGE_METADATA.shop?.title || "Shop - Affordable Wigs Gh",
    description: PAGE_METADATA.shop?.description || "Browse our premium collection of wigs, bundles, closures, and frontals at Affordable Wigs Gh.",
  };
}

// Products loading skeleton
function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-brand-white rounded-premium overflow-hidden shadow-card animate-pulse">
          <div className="aspect-[3/4] bg-brand-sand" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-brand-sand rounded w-1/3" />
            <div className="h-4 bg-brand-sand rounded w-3/4" />
            <div className="h-5 bg-brand-sand rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Filter bar loading skeleton
function FilterBarLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 bg-brand-sand rounded animate-pulse" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-brand-sand rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, search, sort, page } = params;

  // Build query parameters
  const query = {
    category,
    search,
    sort: sort || "-createdAt",
    page: page ? parseInt(page) : 1,
  };

  // Fetch data in parallel
  const [products, categories, totalProducts] = await Promise.all([
    getProducts(query),
    getCategories(),
    getProductsCount({ category, search }),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Shop Hero */}
        <ShopHero />

        {/* Shop Content */}
        <Section background="white" padding="lg">
          <Container>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Filters */}
              <aside className="w-full lg:w-64 flex-shrink-0">
                <Suspense fallback={<FilterBarLoading />}>
                  <FilterBar categories={categories} />
                </Suspense>
              </aside>

              {/* Main Content - Products */}
              <div className="flex-1">
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-brand-gray">
                    {totalProducts} {totalProducts === 1 ? "product" : "products"} found
                    {search && ` for "${search}"`}
                    {category && ` in ${categories.find((c) => c.slug === category)?.name || category}`}
                  </p>
                </div>

                {/* Products Grid */}
                <Suspense fallback={<ProductsLoading />}>
                  {products.length > 0 ? (
                    <ProductGrid products={products} />
                  ) : (
                    <EmptyState
                      title="No products found"
                      message="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
                    />
                  )}
                </Suspense>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
