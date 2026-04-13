import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { BRAND, CONTACT, PRODUCTS } from '@/constants/brand';

/**
 * About Page
 * Brand story and information page
 */
export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About {BRAND.name}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {BRAND.description}
            </p>
          </div>
        </Container>
      </Section>

      {/* Story Section */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Our Story"
                subtitle="Bringing luxury wigs to every woman in Ghana"
                alignment="left"
              />
              <div className="space-y-4 text-[#525252]">
                <p>
                  Founded with a passion for helping women look their best, {BRAND.name} 
                  has become a trusted name in the Ghanaian wig industry. We believe that 
                  every woman deserves to feel confident and beautiful, regardless of her budget.
                </p>
                <p>
                  Our journey began with a simple mission: to provide premium quality wigs 
                  at prices that don't break the bank. Through careful sourcing and strong 
                  supplier relationships, we've made this vision a reality.
                </p>
                <p>
                  Today, we serve hundreds of satisfied customers across Ghana, helping 
                  them discover the perfect wig for their unique style and needs.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-[#f5f3ef] to-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-8xl">👑</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section background="cream">
        <Container>
          <SectionHeading 
            title="Our Values"
            subtitle="What drives everything we do"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <LuxuryCard>
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Quality First
              </h3>
              <p className="text-[#525252]">
                We never compromise on quality. Every wig in our collection is 
                selected for its premium materials and craftsmanship.
              </p>
            </LuxuryCard>
            
            <LuxuryCard>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Affordable Luxury
              </h3>
              <p className="text-[#525252]">
                Luxury shouldn't be reserved for the few. We work hard to bring 
                you premium wigs at accessible prices.
              </p>
            </LuxuryCard>
            
            <LuxuryCard>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Customer Care
              </h3>
              <p className="text-[#525252]">
                Your satisfaction is our priority. We're always here to help you 
                find the perfect look for your unique style.
              </p>
            </LuxuryCard>
          </div>
        </Container>
      </Section>

      {/* Products We Offer */}
      <Section>
        <Container>
          <SectionHeading 
            title="What We Offer"
            subtitle="Explore our wide range of products"
            hasLine
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {PRODUCTS.map((product) => (
              <LuxuryCard key={product} className="text-center">
                <div className="text-4xl mb-3">
                  {product === 'Ready-to-Wear Wigs' && '💇‍♀️'}
                  {product === 'Wig Bundles' && '✨'}
                  {product === 'Closures' && '🎀'}
                  {product === 'Frontals' && '👑'}
                </div>
                <h3 className="font-medium text-[#0a0a0a]">{product}</h3>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="dark">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Browse our collection or chat with us to find your perfect wig today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold">Shop Now</Button>
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="text-white border-white hover:bg-white hover:text-[#0a0a0a]">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}