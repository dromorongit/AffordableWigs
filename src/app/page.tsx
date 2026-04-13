import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND, PRODUCTS, CONTACT } from '@/constants/brand';
import { formatPrice } from '@/utils';

/**
 * Homepage - Modern Beauty E-commerce Style
 * Redesigned for clean, light, editorial, image-driven aesthetic
 * Inspired by premium beauty brands like Hair Virginity
 */
export default function Home() {
  return (
    <>
      {/* Hero Section - Modern Full-width Image Style */}
      <section className="relative min-h-[90vh] flex items-center bg-[#faf9f7] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#d4a853]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#d4a853]/5 rounded-full blur-3xl" />
        </div>
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-4">
                Premium Quality Wigs
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#0a0a0a] mb-6 leading-[1.1]">
                <span className="block">Locks of</span>
                <span className="text-[#d4a853]">Luxury,</span>
                <span>Affordable</span>
              </h1>
              <p className="text-lg text-[#525252] mb-8 leading-relaxed max-w-lg">
                Treat your hair to the best without breaking the bank. 
                Discover our stunning collection of premium wigs and 
                professional styling services in Ghana.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button variant="gold" size="lg">
                    Shop Collection
                  </Button>
                </Link>
                <a 
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="lg" className="text-[#0a0a0a] hover:text-[#d4a853]">
                    Chat with Us
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right: Large Hero Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#f5f3ef] to-[#ebe9e4] rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-9xl block mb-6">✨</span>
                    <p className="text-[#d4a853] text-lg tracking-[0.3em] uppercase">
                      {BRAND.tagline}
                    </p>
                  </div>
                </div>
              </div>
              {/* Subtle corner accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-[#d4a853]/30 rounded-lg" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#d4a853]/30 rounded-lg" />
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Introduction - Editorial Split Layout */}
      <Section padding="large">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Side */}
            <div className="lg:col-span-5">
              <div className="aspect-square bg-gradient-to-br from-[#f5f3ef] to-[#e8e6e1] rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">💇‍♀️</span>
                </div>
              </div>
            </div>
            
            {/* Content Side */}
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                Our Brand
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-6">
                Luxury Wigs, Affordable Prices
              </h2>
              <p className="text-[#525252] text-lg mb-6 leading-relaxed">
                At {BRAND.name}, we believe every woman deserves to feel 
                confident and beautiful. Our mission is to bring you premium 
                quality wigs and professional styling services at prices 
                that don't break the bank.
              </p>
              <p className="text-[#525252] mb-8 leading-relaxed">
                Founded with a passion for helping women look their absolute best, 
                we've become a trusted name in the Ghanaian wig industry. 
                Whether you're looking for a ready-to-wear wig, custom styling, 
                or expert consultation, we're here to make your beauty 
                dreams a reality.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:text-[#d4a853] transition-colors">
                Learn more about us
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Categories - Clean Grid */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Our Collection
            </h2>
          </div>
          
          {/* Clean Grid - No heavy cards, just imagery and text */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRODUCTS.map((product, index) => (
              <Link 
                key={product} 
                href="/shop"
                className="group block"
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="w-full h-full flex items-center justify-center bg-[#faf9f7]">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                      {index === 0 && '💇‍♀️'}
                      {index === 1 && '✨'}
                      {index === 2 && '🎀'}
                      {index === 3 && '👑'}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-[#0a0a0a] text-center">
                  {product}
                </h3>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/shop" className="inline-flex items-center gap-2 text-[#d4a853] font-medium hover:underline">
              Explore All Products
              <span>→</span>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Featured Products - Large Imagery Style */}
      <Section padding="large">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                Trending Now
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
                Featured Pieces
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-[#525252] hover:text-[#0a0a0a] transition-colors">
              View All
              <span>→</span>
            </Link>
          </div>
          
          {/* Large Product Cards - Image focused */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href="/shop" className="group block">
                <div className="aspect-[3/4] bg-[#f5f3ef] rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#faf9f7] to-[#f0ede8]">
                    <span className="text-6xl">👗</span>
                  </div>
                </div>
                <Badge variant="gold" className="mb-2 text-xs">Featured</Badge>
                <h3 className="font-medium text-[#0a0a0a] mb-1">
                  Premium Lace Front Wig
                </h3>
                <p className="text-sm text-[#737373] mb-2">
                  Natural looking, premium quality
                </p>
                <p className="text-[#d4a853] font-medium">
                  {formatPrice(450)}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10 md:hidden">
            <Link href="/shop">
              <Button variant="secondary">View All Products</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Services Highlight - Minimal & Clean */}
      <Section background="cream" padding="large">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                Our Services
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-6">
                Professional Wig Styling
              </h2>
              <p className="text-[#525252] text-lg mb-8 leading-relaxed">
                Beyond selling wigs, we offer professional styling services 
                to help you achieve your perfect look. Expert consultation 
                and personalized styling tailored to you.
              </p>
              
              {/* Simple Service List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a]">Wig Styling</h3>
                    <p className="text-sm text-[#737373]">Professional cutting & customization</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">💎</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a]">Wig Consultation</h3>
                    <p className="text-sm text-[#737373]">Expert advice for your perfect look</p>
                  </div>
                </div>
              </div>
              
              <Link href="/services">
                <Button variant="gold">Explore Services</Button>
              </Link>
            </div>
            
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl block mb-4">✨</span>
                    <span className="text-white/80 text-lg tracking-widest uppercase">
                      beauty for all
                    </span>
                  </div>
                </div>
              </div>
              {/* Subtle accent */}
              <div className="absolute -top-3 -right-3 w-20 h-20 border border-[#d4a853] rounded-lg" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Choose Us - Minimal Icons */}
      <Section padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              Why Us
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              The Affordable Wigs Gh Difference
            </h2>
          </div>
          
          {/* Clean 4-column grid - no cards, just layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'Affordable Luxury', desc: 'Premium quality wigs at prices that fit your budget' },
              { icon: '✨', title: 'Quality First', desc: 'Every wig selected for premium materials and craftsmanship' },
              { icon: '💇‍♀️', title: 'Expert Styling', desc: 'Professional services to achieve your perfect look' },
              { icon: '🤝', title: 'Trusted by Many', desc: 'Hundreds of satisfied customers across Ghana' }
            ].map((reason, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{reason.icon}</div>
                <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">{reason.title}</h3>
                <p className="text-sm text-[#737373]">{reason.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Social Gallery - Instagram Style Grid */}
      <Section padding="large">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                @affordable__wigs
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
                Follow Our Journey
              </h2>
            </div>
            <a 
              href="https://www.instagram.com/affordable__wigs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-[#d4a853] hover:underline"
            >
              Follow on Instagram
              <span>→</span>
            </a>
          </div>
          
          {/* Clean Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div 
                key={item}
                className="aspect-square bg-[#f5f3ef] rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#faf9f7] to-[#f0ede8]">
                  <span className="text-3xl">📸</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <a 
              href="https://www.instagram.com/affordable__wigs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#d4a853] font-medium hover:underline"
            >
              Follow on Instagram
              <span>→</span>
            </a>
          </div>
        </Container>
      </Section>

      {/* Testimonials - Minimal Strip */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              What Our Clients Say
            </h2>
          </div>
          
          {/* Minimal Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                location: "Accra",
                text: "The quality is amazing! My lace front wig looks so natural. Everyone asks where I got it from.",
                rating: 5
              },
              {
                name: "Grace K.",
                location: "Kumasi",
                text: "Fast delivery and excellent customer service. They helped me choose the perfect style for my face shape.",
                rating: 5
              },
              {
                name: "Miriam A.",
                location: "Tema",
                text: "Affordable prices for such premium quality. I've recommended Affordable Wigs Gh to all my friends!",
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[#d4a853]">★</span>
                  ))}
                </div>
                <p className="text-[#525252] mb-4 leading-relaxed">"{review.text}"</p>
                <div>
                  <p className="font-medium text-[#0a0a0a]">{review.name}</p>
                  <p className="text-sm text-[#737373]">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/reviews">
              <Button variant="ghost">Read More Reviews →</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* CTA Section - Clean & Elegant */}
      <Section padding="xlarge">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-[#525252] mb-8 text-lg">
              Join thousands of women who have discovered the beauty of 
              premium wigs at affordable prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="gold" size="lg">
                  Browse Collection
                </Button>
              </Link>
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white">
                  Get Personalized Help
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}