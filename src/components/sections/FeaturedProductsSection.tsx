import Link from "next/link";
import { FEATURED_PRODUCTS, BRAND } from "@/constants";
import { Container, Section, Button } from "@/components/ui";

export function FeaturedProductsSection() {
  return (
    <Section background="cream" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-brand-gold font-accent text-sm tracking-widest uppercase mb-4">
              Featured
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-brand-black">
              Our Popular Wigs
            </h2>
          </div>
          <Link href="/contact">
            <Button variant="outline" size="md">
              View All Products
            </Button>
          </Link>
        </div>

        {/* Products Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href="/contact"
              className="group"
            >
              <div className="bg-brand-white rounded-premium overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Product Image Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-brand-sand to-brand-ivory relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-brand-nude" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-brand-white/90 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-brand-black">
                      {BRAND.currencySymbol}{product.price}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-brand-taupe mb-1">{product.category}</p>
                  <h3 className="font-heading text-base text-brand-black group-hover:text-brand-gold transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-brand-gold mt-1">
                    {BRAND.currencySymbol}{product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-8 md:hidden">
          <Link href="/contact">
            <Button variant="primary" size="md" className="w-full">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}