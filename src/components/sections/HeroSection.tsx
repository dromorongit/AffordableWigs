import Link from "next/link";
import { BRAND, CONTACT } from "@/constants";
import { Container, Button, Section } from "@/components/ui";

export function HeroSection() {
  return (
    <Section background="cream" padding="none" className="pt-20">
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 max-w-xl">
              <span className="inline-block text-brand-gold font-accent text-lg tracking-widest uppercase mb-4">
                Premium Wigs in Ghana
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-black leading-tight mb-6">
                {BRAND.tagline}
              </h1>
              <p className="text-brand-gray text-lg leading-relaxed mb-8">
                {BRAND.description}. Discover our stunning collection of premium wigs, bundles, closures, and frontals designed to make you look and feel absolutely stunning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Explore Collection
                  </Button>
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-brand-nude">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <span className="block font-heading text-2xl text-brand-black">500+</span>
                    <span className="text-brand-gray text-sm">Happy Customers</span>
                  </div>
                  <div>
                    <span className="block font-heading text-2xl text-brand-black">4.9</span>
                    <span className="text-brand-gray text-sm">Star Rating</span>
                  </div>
                  <div>
                    <span className="block font-heading text-2xl text-brand-black">50+</span>
                    <span className="text-brand-gray text-sm">Wig Styles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual Content */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/5] max-w-lg mx-auto">
                {/* Placeholder for Hero Image - Elegant abstract representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-ivory rounded-premium-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                        <svg className="w-20 h-20 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <p className="font-heading text-xl text-brand-charcoal">Luxury Meets Affordability</p>
                      <p className="text-brand-taupe text-sm mt-2">Premium Wigs for Every Style</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-brand-gold/30 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-gold/10 rounded-full" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}