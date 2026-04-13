import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { CONTACT, BRAND } from '@/constants/brand';

/**
 * Services Page
 * Professional wig styling services offered by the brand
 * Phase 2 - Fully implemented with premium luxury branding
 */
export default function ServicesPage() {
  const mainServices = [
    {
      icon: "✂️",
      name: "Wig Styling",
      description: "Transform your look with our professional styling services. Whether you need a fresh cut, custom shaping, or a complete transformation, our experts will give your wig a natural, personalized look that complements your face shape and style preferences.",
      features: ["Custom Cutting", "Shaping & Trimming", "Style Customization", "Natural finish"]
    },
    {
      icon: "💎",
      name: "Wig Consultation",
      description: "Not sure which wig suits you best? Our expert consultation helps you find the perfect match for your face shape, lifestyle, and budget. Get personalized recommendations from our experienced team.",
      features: ["Face Shape Analysis", "Style Recommendations", "Budget-friendly options", "Expert advice"]
    }
  ];

  // Additional services removed per brand requirements

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
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional <span className="text-[#d4a853]">Wig Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Expert styling and consultation services to help you achieve your perfect look
            </p>
          </div>
        </Container>
        
        {/* Gold Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />
      </section>

      {/* Main Services */}
      <Section background="cream">
        <Container>
          <SectionHeading 
            title="Our Core Services"
            subtitle="Professional services to transform your look"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {mainServices.map((service, index) => (
              <LuxuryCard key={index} className="relative">
                {index === 0 && (
                  <Badge variant="gold" className="absolute -top-3 left-6">Popular</Badge>
                )}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#0a0a0a] mb-2">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <p className="text-[#525252] text-lg mb-6">
                  {service.description}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-[#0a0a0a] mb-3">What's included:</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#525252]">
                        <span className="w-1.5 h-1.5 bg-[#d4a853] rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <a 
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="lg" fullWidth>
                      Inquire Now
                    </Button>
                  </a>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process Section */}
      <Section background="cream">
        <Container>
          <SectionHeading 
            title="How It Works"
            subtitle="Getting your wig styled is easy"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              { step: "01", title: "Contact Us", desc: "Reach out via WhatsApp or visit our location" },
              { step: "02", title: "Consultation", desc: "We'll discuss your style preferences and needs" },
              { step: "03", title: "Service", desc: "Our experts work their magic on your wig" },
              { step: "04", title: "Pick Up", desc: "Collect your beautifully styled wig" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#d4a853] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-[#0a0a0a]">{item.step}</span>
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">{item.title}</h3>
                <p className="text-sm text-[#525252]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="dark">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-gray-400 mb-8">
              Chat with us on WhatsApp to discuss your styling needs and book an appointment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" size="lg">
                  💬 Chat with Us
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white hover:text-[#0a0a0a]">
                  Get Directions
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}