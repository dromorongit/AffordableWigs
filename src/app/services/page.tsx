import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";
import { SERVICES, CONTACT, PAGE_METADATA } from "@/constants";

export const metadata: Metadata = {
  title: PAGE_METADATA.services.title,
  description: PAGE_METADATA.services.description,
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="cream" padding="none" className="pt-20">
          <div className="relative min-h-[60vh] flex items-center">
            <Container>
              <div className="max-w-3xl">
                <span className="inline-block text-brand-gold font-accent text-sm tracking-widest uppercase mb-4">
                  Our Services
                </span>
                <h1 className="font-heading text-4xl md:text-5xl text-brand-black mb-6">
                  Professional Wig Services
                </h1>
                <p className="text-brand-gray text-lg leading-relaxed">
                  We offer professional wig styling and consultation services to help 
                  you find the perfect look. Our expert team is dedicated to making you 
                  look and feel your best.
                </p>
              </div>
            </Container>
          </div>
        </Section>

        {/* Services Detail */}
        <Section background="white" padding="lg">
          <Container>
            <div className="space-y-16">
              {/* Service 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1l-2.36-2.36c.5-.23 1.05-.36 1.64-.36 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.59.13-1.14.36-1.64L7 10H1l7-7 2.64 2.64z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl text-brand-black mb-4">
                    {SERVICES[0].name}
                  </h2>
                  <p className="text-brand-gray leading-relaxed mb-6">
                    {SERVICES[0].description}. Our professional stylists are 
                    trained to transform your wig into a stunning look that complements 
                    your features and personal style.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Custom cut and style
                    </li>
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Color treatment
                    </li>
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Styling and maintenance tips
                    </li>
                  </ul>
                  <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="md">
                      Book Now
                    </Button>
                  </a>
                </div>
                <div className="order-1 lg:order-2 relative aspect-square lg:aspect-[4/5]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-ivory rounded-premium-lg" />
                </div>
              </div>

              {/* Service 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="relative aspect-square lg:aspect-[4/5]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-ivory rounded-premium-lg" />
                </div>
                <div>
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl text-brand-black mb-4">
                    {SERVICES[1].name}
                  </h2>
                  <p className="text-brand-gray leading-relaxed mb-6">
                    {SERVICES[1].description}. Not sure which wig suits you best? 
                    Our expert consultation helps you choose the perfect wig based on 
                    your face shape, lifestyle, and preferences.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Face shape analysis
                    </li>
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Personalized recommendations
                    </li>
                    <li className="flex items-center gap-3 text-brand-gray">
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Quality guidance
                    </li>
                  </ul>
                  <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="md">
                      Book Consultation
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="black" padding="lg">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl text-brand-white mb-6">
                Ready to Transform Your Look?
              </h2>
              <p className="text-brand-light-gray mb-8">
                Chat with us on WhatsApp to book your appointment or learn more about our services.
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