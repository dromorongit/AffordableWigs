import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { PRODUCTS } from '@/constants/brand';
import { formatPrice } from '@/utils';

/**
 * Shop Page
 * Product catalog placeholder - full implementation in Phase 2
 */
export default function ShopPage() {
  return (
    <>
      {/* Hero Section */}
      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shop Our Collection
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover premium wigs and hair products at affordable prices
            </p>
          </div>
        </Container>
      </Section>

      {/* Categories Filter */}
      <Section padding="small">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary">All Products</Button>
            {PRODUCTS.map((product) => (
              <Button key={product} variant="secondary">
                {product}
              </Button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Products Grid - Placeholder */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <LuxuryCard key={item} padding="none" className="overflow-hidden group">
                {/* Product Image Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">👗</span>
                  </div>
                  {/* Sale Badge */}
                  {item % 3 === 0 && (
                    <Badge variant="gold" className="absolute top-3 left-3">
                      Sale
                    </Badge>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">
                    {PRODUCTS[item % PRODUCTS.length]}
                  </p>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2 group-hover:text-[#d4a853] transition-colors">
                    Premium Lace Front Wig - Style {item}
                  </h3>
                  <p className="text-sm text-[#525252] mb-3 line-clamp-2">
                    Beautiful natural-looking lace front wig with premium 
                    quality hair. Perfect for everyday wear.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-[#d4a853]">
                        {formatPrice(350 + item * 50)}
                      </span>
                      {item % 3 === 0 && (
                        <span className="text-sm text-[#737373] line-through">
                          {formatPrice(450 + item * 50)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="primary" size="sm" fullWidth className="mt-4">
                    View Details
                  </Button>
                </div>
              </LuxuryCard>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="secondary" size="lg">
              Load More Products
            </Button>
          </div>
        </Container>
      </Section>

      {/* Coming Soon Note */}
      <Section background="cream">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-4">
              More Products Coming Soon
            </h2>
            <p className="text-[#525252] mb-6">
              We're constantly updating our collection with new styles. 
              Chat with us on WhatsApp to be the first to know about new arrivals!
            </p>
            <Button variant="gold">
              💬 Chat with Us
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}