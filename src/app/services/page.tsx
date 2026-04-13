import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { CONTACT } from '@/constants/brand';

/**
 * Services Page
 * Professional wig styling services offered by the brand
 */
export default function ServicesPage() {
  const services = [
    {
      icon: "✂️",
      name: "Wig Styling",
      description: "Professional cutting and styling to give your wig a natural, personalized look that complements your face shape and style preferences.",
      price: "From GH₵ 150",
      duration: "1-2 hours"
    },
    {
      icon: "🎨",
      name: "Color Customization",
      description: "Want to change up your look? We offer professional coloring services to give your wig a fresh, vibrant appearance.",
      price: "From GH₵ 200",
      duration: "2-3 hours"
    },
    {
      icon: "👗",
      name: "Wig Plucking",
      description: "Our experts will pluck the hairline to create a more natural, seamless look that matches your skin tone and hairline.",
      price: "From GH₵ 80",
      duration: "45 mins - 1 hour"
    },
    {
      icon: "💆‍♀️",
      name: "Hair Treatment",
      description: "Deep conditioning and treatment services to keep your wig looking healthy, shiny, and luxurious for longer.",
      price: "From GH₵ 100",
      duration: "1 hour"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional wig styling and customization services to help you achieve your perfect look
            </p>
          </div>
        </Container>
      </Section>

      {/* Services List */}
      <Section>
        <Container>
          <SectionHeading 
            title="What We Offer"
            subtitle="Expert services to keep your wigs looking their best"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {services.map((service, index) => (
              <LuxuryCard key={index} className="flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#f5f3ef] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0a0a0a] mb-1">
                      {service.name}
                    </h3>
                    <Badge variant="gold" size="sm">{service.duration}</Badge>
                  </div>
                </div>
                <p className="text-[#525252] flex-grow mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-semibold text-[#d4a853]">
                    {service.price}
                  </span>
                  <a 
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm">
                      Book Now
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
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#0a0a0a] mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-[#525252] mb-8">
              Chat with us on WhatsApp to discuss your styling needs and book an appointment.
            </p>
            <a 
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gold" size="lg">
                💬 Chat with Us on WhatsApp
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}