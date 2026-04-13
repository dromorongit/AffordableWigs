import Link from "next/link";
import { PRODUCTS } from "@/constants";
import { Container, Section } from "@/components/ui";

export function CategoriesSection() {
  return (
    <Section background="white" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-brand-gold font-accent text-sm tracking-widest uppercase mb-4">
            Our Collection
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-brand-black">
            Browse by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.map((category, index) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square bg-brand-cream rounded-premium overflow-hidden transition-all duration-500 group-hover:shadow-premium-hover">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-ivory" />
                
                {/* Decorative Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-brand-white/80 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-10 h-10 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-brand-white/90 py-4 px-4 text-center">
                  <h3 className="font-heading text-base text-brand-black group-hover:text-brand-gold transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}