import { CONTACT, BRAND } from "@/constants";
import { Container, Section, Button } from "@/components/ui";

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.524.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.564-1.055c-.424 0-.845.138-1.212.398l-1.525.628-1.147-.247-4.899 2.827a9.97 9.97 0 01-.63 2.235c-.16.32-.356.64-.598.924l-.27.3-4.045-.951-.27.374c.274.656.781 1.892 1.529 2.82 1.164 1.447 2.43 2.443 4.148 2.943.426.124.866.187 1.32.187.962 0 1.87-.173 2.56-.598.689-.424 1.271-.984 1.705-1.773l.173-.261-.538.257c.063.372.163.752.262 1.132.099.381.173.771.173 1.161 0 .381-.149.693-.422.943l-.446.446-4.334-1.104 2.551 1.253c.31-.601.536-1.257.63-1.935.173-.679-.052-1.502-.595-2.078l.263-.374-1.252.37c.124.381.224.771.224 1.182z" />
                </svg>
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