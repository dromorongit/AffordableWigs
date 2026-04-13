import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND, CONTACT, PRODUCTS } from '@/constants/brand';

/**
 * About Page - Modern Editorial Brand Story Style
 * Clean, light, image-driven aesthetic
 */
export default function AboutPage() {
  return (
    <>
      {/* Hero Section - Light & Clean */}
      <section className="relative py-24 md:py-32 bg-[#faf9f7] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#d4a853]/5 rounded-full blur-3xl" />
        </div>
        
        <Container>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-4">
              Our Story
            </p>
            <h1 className="text-4xl md:text-5xl font-normal text-[#0a0a0a] mb-6">
              About {BRAND.name}
            </h1>
            <p className="text-lg text-[#525252]">
              {BRAND.tagline}
            </p>
          </div>
        </Container>
      </section>

      {/* Brand Story - Editorial Split Layout */}
      <Section padding="large">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Side */}
            <div className="lg:col-span-5">
              <div className="aspect-square bg-gradient-to-br from-[#f5f3ef] to-[#e8e6e1] rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl block mb-4">💇‍♀️</span>
                    <p className="text-[#d4a853] text-sm tracking-[0.2em] uppercase">
                      Beauty for All
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Side */}
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-6">
                Empowering Women Through Beauty
              </h2>
              <div className="space-y-5 text-[#525252] text-lg leading-relaxed">
                <p>
                  At <span className="font-medium text-[#0a0a0a]">{BRAND.name}</span>, we believe every woman 
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
          </div>
        </Container>
      </Section>

      {/* Values Section - Clean Grid */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Our Values
            </h2>
          </div>
          
          {/* Clean 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-medium text-[#0a0a0a] mb-3">
                Quality First
              </h3>
              <p className="text-[#737373]">
                We never compromise on quality. Every wig in our collection is 
                selected for its premium materials and craftsmanship.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-medium text-[#0a0a0a] mb-3">
                Affordable Luxury
              </h3>
              <p className="text-[#737373]">
                Luxury shouldn't be reserved for the few. We work hard to bring 
                you premium wigs at accessible prices.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-medium text-[#0a0a0a] mb-3">
                Customer Care
              </h3>
              <p className="text-[#737373]">
                Your satisfaction is our priority. We're always here to help you 
                find the perfect look for your unique style.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Products We Offer - Minimal Grid */}
      <Section padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              What We Provide
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Our Products
            </h2>
          </div>
          
          {/* Clean 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRODUCTS.map((product, index) => (
              <Link key={product} href="/shop" className="group block text-center">
                <div className="aspect-square bg-[#f5f3ef] rounded-lg overflow-hidden mb-4 group-hover:bg-[#f0ede8] transition-colors">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">
                      {index === 0 && '💇‍♀️'}
                      {index === 1 && '✨'}
                      {index === 2 && '🎀'}
                      {index === 3 && '👑'}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-[#0a0a0a]">{product}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us - Minimal List */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              The Affordable Wigs Gh Advantage
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Why Choose Us
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-5 bg-white rounded-lg">
              <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#d4a853]">✓</span>
              </div>
              <div>
                <h3 className="font-medium text-[#0a0a0a] mb-1">
                  Premium Quality
                </h3>
                <p className="text-sm text-[#737373]">
                  Every wig is carefully selected for premium materials and craftsmanship.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-white rounded-lg">
              <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#d4a853]">✓</span>
              </div>
              <div>
                <h3 className="font-medium text-[#0a0a0a] mb-1">
                  Affordable Prices
                </h3>
                <p className="text-sm text-[#737373]">
                  Luxury wigs at prices that fit your budget.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-white rounded-lg">
              <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#d4a853]">✓</span>
              </div>
              <div>
                <h3 className="font-medium text-[#0a0a0a] mb-1">
                  Expert Consultation
                </h3>
                <p className="text-sm text-[#737373]">
                  Personalized advice to find your perfect match.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-white rounded-lg">
              <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#d4a853]">✓</span>
              </div>
              <div>
                <h3 className="font-medium text-[#0a0a0a] mb-1">
                  Professional Styling
                </h3>
                <p className="text-sm text-[#737373]">
                  Expert styling services for a look that's uniquely yours.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section - Light & Clean */}
      <Section padding="xlarge">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-[#525252] mb-8 text-lg">
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
                <Button variant="secondary" size="lg" className="border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white">
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