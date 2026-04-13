import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { BRAND, CONTACT, PRODUCTS } from '@/constants/brand';

/**
 * About Page
 * Brand story and information page
 * Phase 2 - Fully implemented with premium luxury branding
 */
export default function AboutPage() {
  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4a853] to-transparent" />
        </div>
        
        <Container>
          <div className="relative z-10 text-center">
            <Badge variant="gold" className="mb-6">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-[#d4a853]">{BRAND.name}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {BRAND.tagline}
            </p>
          </div>
        </Container>
        
        {/* Gold Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />
      </section>

      {/* Brand Story Section */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Our Mission"
                subtitle="{BRAND.description}"
                alignment="left"
              />
              <div className="space-y-6 text-[#525252] text-lg">
                <p>
                  At <span className="font-semibold text-[#0a0a0a]">{BRAND.name}</span>, we believe every woman 
                  deserves to feel confident, beautiful, and ready to take on the world—
                  without worrying about the price tag.
                </p>
                <p>
                  Founded with a passion for helping women look their absolute best, we've 
                  become a trusted name in the Ghanaian wig industry. Our journey began with 
                  a simple vision: to provide premium quality wigs at prices that don't break the bank.
                </p>
                <p>
                  Through careful sourcing and strong supplier relationships, we've made this 
                  vision a reality. Today, we serve hundreds of satisfied customers across Ghana, 
                  helping them discover the perfect wig for their unique style and needs.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl block mb-4">💇‍♀️</span>
                  <span className="text-[#d4a853] text-xl font-medium tracking-widest uppercase">
                    Beauty for All
                  </span>
                </div>
              </div>
              {/* Gold accent corners */}
              <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-[#d4a853] rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-[#d4a853] rounded-bl-lg" />
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

      {/* Trust Section */}
      <Section>
        <Container>
          <SectionHeading 
            title="Why Choose {BRAND.name}"
            subtitle="Discover what sets us apart"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <LuxuryCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">
                    Premium Quality
                  </h3>
                  <p className="text-[#525252]">
                    Every wig is carefully selected for its premium materials, craftsmanship, and natural look. 
                    We never compromise on quality.
                  </p>
                </div>
              </div>
            </LuxuryCard>
            
            <LuxuryCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">
                    Affordable Prices
                  </h3>
                  <p className="text-[#525252]">
                    Luxury shouldn't cost a fortune. We offer premium wigs at prices that fit your budget 
                    without sacrificing quality.
                  </p>
                </div>
              </div>
            </LuxuryCard>
            
            <LuxuryCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">
                    Expert Consultation
                  </h3>
                  <p className="text-[#525252]">
                    Not sure which wig suits you best? Our experts provide personalized advice to help you 
                    find your perfect match.
                  </p>
                </div>
              </div>
            </LuxuryCard>
            
            <LuxuryCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">
                    Professional Styling
                  </h3>
                  <p className="text-[#525252]">
                    Beyond selling wigs, we offer professional styling services to give you a look that's 
                    uniquely yours.
                  </p>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="dark">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Browse our collection or chat with us to find your perfect wig today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="gold" size="lg">Shop Collection</Button>
              </Link>
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white hover:text-[#0a0a0a]">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}