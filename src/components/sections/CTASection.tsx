import { CONTACT, BRAND } from "@/constants";
import { Container, Section, Button } from "@/components/ui";
import { FaWhatsapp } from "react-icons/fa";

export function CTASection() {
  return (
    <Section background="black" padding="lg">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-brand-white mb-6">
            Ready to Find Your Perfect Look?
          </h2>
          <p className="text-brand-light-gray text-lg mb-8">
            Chat with us on WhatsApp to explore our collection and find the perfect wig for you. 
            We're here to help you look and feel your best!
          </p>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg">
              <span className="flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5" />
                Chat on WhatsApp
              </span>
            </Button>
          </a>
          <p className="text-brand-taupe text-sm mt-6">
            Response time: Usually within minutes
          </p>
        </div>
      </Container>
    </Section>
  );
}