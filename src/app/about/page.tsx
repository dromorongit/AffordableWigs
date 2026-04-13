import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";
import { BRAND, CONTACT, PAGE_METADATA } from "@/constants";

export const metadata: Metadata = {
  title: PAGE_METADATA.about.title,
  description: PAGE_METADATA.about.description,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <Section background="cream" padding="none" className="pt-20">
          <div className="relative min-h-[60vh] flex items-center">
            <Container>
              <div className="max-w-3xl">
                <span className="inline-block text-brand-gold font-accent text-sm tracking-widest uppercase mb-4">
                  About Us
                </span>
                <h1 className="font-heading text-4xl md:text-5xl text-brand-black mb-6">
                  Our Story
                </h1>
                <p className="text-brand-gray text-lg leading-relaxed mb-8">
                  Welcome to {BRAND.name} &mdash; your trusted destination for 
                  premium wigs in Ghana. We believe that everyone deserves to feel confident, 
                  beautiful, and empowered, and that luxury shouldn't come at a premium price.
                </p>
              </div>
            </Container>
          </div>
        </Section>

        {/* Brand Story */}
        <Section background="white" padding="lg">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl text-brand-black mb-6">
                  Locks of Luxury, Affordable Prices
                </h2>
                <div className="space-y-4 text-brand-gray leading-relaxed">
                  <p>
                    Founded with a vision to democratize luxury hair, {BRAND.name} 
                    has become a leading name in Ghana's wig industry. We specialize in 
                    sourcing and providing the finest quality wigs, bundles, closures, and frontals.
                  </p>
                  <p>
                    Our journey began with a simple mission: to make premium quality wigs 
                    accessible to every woman in Ghana who deserves to look and feel her best. 
                    We understood that beauty is confidence, and confidence shouldn't be expensive.
                  </p>
                  <p>
                    Today, we serve hundreds of happy customers across Ghana, helping 
                    them discover the perfect wig that complements their style and personality. 
                    Our commitment to quality, affordability, and exceptional customer 
                    service sets us apart.
                  </p>
                </div>
              </div>

              {/* Visual */}
              <div className="relative aspect-square lg:aspect-[4/5]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-ivory rounded-premium-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                        <svg className="w-16 h-16 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <p className="font-heading text-xl text-brand-charcoal">
                        Empowering Women
                      </p>
                      <p className="text-brand-taupe text-sm mt-2">
                        Since 2020
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Values */}
        <Section background="ivory" padding="lg">
          <Container>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-brand-black">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-brand-white rounded-premium p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-brand-black mb-2">Quality First</h3>
                <p className="text-brand-gray text-sm">
                  We never compromise on quality. Every wig is carefully sourced and inspected to meet our high standards.
                </p>
              </div>

              <div className="bg-brand-white rounded-premium p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-1.5v1.96c-1.86.45-3.81 1.86-3.81 4.05 0 2.44 2.12 4.15 5.36 4.77 2.05.39 2.71.89 2.71 1.85 0 .96-.74 1.79-2.16 1.79-1.71 0-2.47-.88-2.56-2.1H7.14c.08 1.72 1.16 3.31 3.31 3.81V21h1.5v-1.96c1.86-.45 3.81-1.86 3.81-4.05.05-2.44-2.07-4.15-5.36-4.77z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-brand-black mb-2">Affordable Luxury</h3>
                <p className="text-brand-gray text-sm">
                  Luxury wigs at prices that won't break the bank. Beautiful hair for everyone.
                </p>
              </div>

              <div className="bg-brand-white rounded-premium p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-brand-black mb-2">Customer Focus</h3>
                <p className="text-brand-gray text-sm">
                  Your satisfaction is our priority. We're here to help you find your perfect look.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="black" padding="lg">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl text-brand-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-brand-light-gray mb-8">
                Let us help you find the perfect wig that makes you feel confident and beautiful.
              </p>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}