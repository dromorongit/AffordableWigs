import Link from "next/link";
import { Container, Section, Button } from "@/components/ui";
import { getServices } from "@/lib/products";

// Revalidate every 60 seconds to ensure fresh service data
export const revalidate = 60;

export async function ServicesSection() {
  const services = await getServices();
  return (
    <Section background="white" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
            What We Offer
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
            Our Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service._id.toString()}
              className="bg-background-cream rounded-premium-lg p-8 md:p-10 transition-all duration-300 hover:shadow-premium"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1l-2.36-2.36c.5-.23 1.05-.36 1.64-.36 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.59.13-1.14.36-1.64L7 10H1l7-7 2.64 2.64z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-heading text-xl text-text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-light mb-6">
            Ready to transform your look? Let's chat!
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}