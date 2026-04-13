import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CONTACT, BRAND } from '@/constants/brand';

/**
 * Services Page - Elegant Simplified Style
 * Clean, light, minimal aesthetic
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
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl font-normal text-[#0a0a0a] mb-6">
              Professional <span className="text-[#d4a853]">Wig Services</span>
            </h1>
            <p className="text-lg text-[#525252]">
              Expert styling and consultation services to help you achieve your perfect look
            </p>
          </div>
        </Container>
      </section>

      {/* Main Services - Clean Layout */}
      <Section padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Our Core Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mainServices.map((service, index) => (
              <div key={index} className="bg-[#faf9f7] p-8 rounded-lg">
                {index === 0 && (
                  <Badge variant="gold" className="mb-4 text-xs">Popular</Badge>
                )}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl font-normal text-[#0a0a0a]">
                    {service.name}
                  </h3>
                </div>
                <p className="text-[#525252] mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="pt-5 border-t border-gray-200">
                  <p className="text-sm font-medium text-[#0a0a0a] mb-3">What's included:</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#737373]">
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
                    <Button variant="gold" size="lg" fullWidth>
                      Inquire Now
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process Section - Clean Steps */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Getting Your Wig Styled
            </h2>
          </div>
          
          {/* Clean 4-step horizontal process */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Contact Us", desc: "Reach out via WhatsApp or visit our location" },
              { step: "02", title: "Consultation", desc: "We'll discuss your style preferences and needs" },
              { step: "03", title: "Service", desc: "Our experts work their magic on your wig" },
              { step: "04", title: "Pick Up", desc: "Collect your beautifully styled wig" }
            ].map((item, index) => (
              <div key={index} className="text-center p-5">
                <div className="w-12 h-12 bg-[#d4a853] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-medium text-[#0a0a0a]">{item.step}</span>
                </div>
                <h3 className="font-medium text-[#0a0a0a] mb-2">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA - Light & Clean */}
      <Section padding="xlarge">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-[#525252] mb-8">
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
                <Button variant="secondary" size="lg" className="border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white">
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