import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { BRAND, PRODUCTS, CONTACT } from '@/constants/brand';
import { formatPrice } from '@/utils';

/**
 * Homepage
 * Premium luxury wig brand landing page with placeholder sections
 * Full content will be implemented in future phases
 */
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0a0a0a] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4a853] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
        
        <Container>
          <div className="relative z-10 max-w-3xl">
            <Badge variant="gold" className="mb-6">
              Premium Quality Wigs
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Locks of Luxury,
              <span className="text-[#d4a853] block">Affordable Prices</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Treat your hair to the best without breaking the bank. 
              Discover our stunning collection of premium wigs and styling services in Ghana.
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
                <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white hover:text-[#0a0a0a]">
                  Chat with Us
                </Button>
              </a>
            </div>
          </div>
        </Container>

        {/* Gold Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />
      </section>

      {/* Brand Introduction */}
      <Section background="cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-4">
                Our Brand
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
                Luxury Wigs, Affordable Prices
              </h2>
              <p className="text-[#525252] text-lg mb-6">
                At {BRAND.name}, we believe every woman deserves to feel confident and beautiful. 
                Our mission is to bring you premium quality wigs and professional styling services 
                at prices that don't break the bank.
              </p>
              <p className="text-[#525252] mb-8">
                Founded with a passion for helping women look their absolute best, we've become 
                a trusted name in the Ghanaian wig industry. Whether you're looking for a ready-to-wear 
                wig, custom styling, or expert consultation, we're here to make your beauty dreams a reality.
              </p>
              <Link href="/about" className="inline-flex items-center text-[#d4a853] font-medium hover:underline">
                Learn more about us →
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl block mb-4">✨</span>
                  <span className="text-white text-2xl font-light tracking-widest uppercase">
                    {BRAND.tagline}
                  </span>
                </div>
              </div>
              {/* Gold accent corner */}
              <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-[#d4a853] rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-[#d4a853] rounded-bl-lg" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Categories */}
      <Section>
        <Container>
          <SectionHeading 
            title="Our Collection"
            subtitle="Explore our curated selection of premium wigs and hair products"
            hasLine
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {PRODUCTS.map((product, index) => (
              <LuxuryCard 
                key={product}
                className="text-center group cursor-pointer"
                hover
              >
                <div className="aspect-square bg-[#f5f3ef] rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {index === 0 && '💇‍♀️'}
                    {index === 1 && '✨'}
                    {index === 2 && '🎀'}
                    {index === 3 && '👑'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">
                  {product}
                </h3>
                <p className="text-sm text-[#525252]">
                  Click to explore our {product.toLowerCase()}
                </p>
                <Link href="/shop" className="mt-4 inline-flex items-center text-[#d4a853] text-sm font-medium hover:underline">
                  Shop Now →
                </Link>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Products Placeholder */}
      <Section>
        <Container>
          <SectionHeading 
            title="Trending Now"
            subtitle="Our most beloved pieces this season"
            hasLine
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[1, 2, 3, 4].map((item) => (
              <LuxuryCard key={item} padding="none" className="overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-6xl">👗</span>
                </div>
                <div className="p-5">
                  <Badge variant="gold" className="mb-2">Featured</Badge>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">
                    Premium Lace Front Wig
                  </h3>
                  <p className="text-sm text-[#525252] mb-3">
                    Natural looking, premium quality
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#d4a853]">
                      {formatPrice(450)}
                    </span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="primary">View All Products</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Services Highlight */}
      <Section background="dark">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Professional Wig Styling
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Beyond selling wigs, we offer professional styling services to help you achieve your perfect look
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <LuxuryCard background="default" className="border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✂️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Wig Styling
                  </h3>
                  <p className="text-gray-400">
                    Professional cutting, styling, and customization services to give your wig a natural, personalized look.
                  </p>
                </div>
              </div>
            </LuxuryCard>
            
            <LuxuryCard background="default" className="border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Wig Consultation
                  </h3>
                  <p className="text-gray-400">
                    Expert advice on choosing the perfect wig for your face shape, lifestyle, and budget.
                  </p>
                </div>
              </div>
            </LuxuryCard>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="gold">Explore All Services</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section background="cream">
        <Container>
          <SectionHeading 
            title="Why Choose Us"
            subtitle="Experience the Affordable Wigs Gh difference"
            hasLine
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: '💰', title: 'Affordable Luxury', desc: 'Premium quality wigs at prices that fit your budget' },
              { icon: '✨', title: 'Quality First', desc: 'Every wig selected for premium materials and craftsmanship' },
              { icon: '💇‍♀️', title: 'Expert Styling', desc: 'Professional services to achieve your perfect look' },
              { icon: '🤝', title: 'Trusted by Many', desc: 'Hundreds of satisfied customers across Ghana' }
            ].map((reason, index) => (
              <LuxuryCard key={index} className="text-center">
                <div className="text-4xl mb-3">{reason.icon}</div>
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{reason.title}</h3>
                <p className="text-sm text-[#525252]">{reason.desc}</p>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* Social Gallery */}
      <Section>
        <Container>
          <SectionHeading 
            title="Follow Our Journey"
            subtitle="See our latest styles and transformations on social media"
            hasLine
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div 
                key={item}
                className="aspect-square bg-gradient-to-br from-[#f5f3ef] to-gray-200 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="text-3xl">📸</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="https://www.instagram.com/affordable__wigs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#d4a853] font-medium hover:underline"
            >
              Follow us on Instagram →
            </a>
          </div>
        </Container>
      </Section>

      {/* Reviews Preview */}
      <Section>
        <Container>
          <SectionHeading 
            title="What Our Clients Say"
            subtitle="Join hundreds of satisfied customers across Ghana"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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
              <LuxuryCard key={index}>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[#d4a853]">⭐</span>
                  ))}
                </div>
                <p className="text-[#525252] mb-4 italic">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#0a0a0a]">{review.name}</p>
                    <p className="text-sm text-[#737373]">{review.location}</p>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/reviews">
              <Button variant="secondary">Read More Reviews</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Social Proof / CTA */}
      <Section background="ivory">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0a0a0a] mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-[#525252] mb-8 text-lg">
              Join thousands of women who have discovered the beauty of premium wigs at affordable prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Browse Collection
                </Button>
              </Link>
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" size="lg">
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