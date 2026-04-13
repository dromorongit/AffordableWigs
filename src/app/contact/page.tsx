import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";
import { CONTACT, SOCIALS, PRODUCTS, PAGE_METADATA } from "@/constants";

export const metadata: Metadata = {
  title: PAGE_METADATA.contact.title,
  description: PAGE_METADATA.contact.description,
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="cream" padding="none" className="pt-20">
          <div className="relative min-h-[50vh] flex items-center">
            <Container>
              <div className="max-w-3xl text-center mx-auto">
                <span className="inline-block text-brand-gold font-accent text-sm tracking-widest uppercase mb-4">
                  Contact Us
                </span>
                <h1 className="font-heading text-4xl md:text-5xl text-brand-black mb-6">
                  Get in Touch
                </h1>
                <p className="text-brand-gray text-lg leading-relaxed">
                  Have questions? Want to place an order? We're here to help! 
                  Reach out to us through any of the channels below.
                </p>
              </div>
            </Container>
          </div>
        </Section>

        {/* Contact Options */}
        <Section background="white" padding="lg">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* WhatsApp */}
              <div className="bg-brand-white rounded-premium-lg p-8 text-center shadow-card">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.524.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.564-1.055c-.424 0-.845.138-1.212.398l-1.525.628-1.147-.247-4.899 2.827a9.97 9.97 0 01-.63 2.235c-.16.32-.356.64-.598.924l-.27.3-4.045-.951-.27.374c.274.656.781 1.892 1.529 2.82 1.164 1.447 2.43 2.443 4.148 2.943.426.124.866.187 1.32.187.962 0 1.87-.173 2.56-.598.689-.424 1.271-.984 1.705-1.773l.173-.261-.538.257c.063.372.163.752.262 1.132.099.381.173.771.173 1.161 0 .381-.149.693-.422.943l-.446.446-4.334-1.104 2.551 1.253c.31-.601.536-1.257.63-1.935.173-.679-.052-1.502-.595-2.078l.263-.374-1.252.37c.124.381.224.771.224 1.182z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-brand-black mb-2">WhatsApp</h3>
                <p className="text-brand-gray text-sm mb-4">Chat with us for quick responses</p>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    Open WhatsApp
                  </Button>
                </a>
              </div>

              {/* Phone */}
              <div className="bg-brand-white rounded-premium-lg p-8 text-center shadow-card">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-brand-black mb-2">Phone</h3>
                <p className="text-brand-gray text-sm mb-4">Call us during business hours</p>
                <a href={`tel:${CONTACT.phone}`}>
                  <Button variant="outline" size="sm">
                    {CONTACT.phone}
                  </Button>
                </a>
              </div>

              {/* Location */}
              <div className="bg-brand-white rounded-premium-lg p-8 text-center shadow-card">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-brand-black mb-2">Location</h3>
                <p className="text-brand-gray text-sm mb-4">Visit our shop</p>
                <p className="text-brand-charcoal text-sm">{CONTACT.location}</p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Social & Products */}
        <Section background="ivory" padding="lg">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Social Media */}
              <div>
                <h2 className="font-heading text-2xl text-brand-black mb-6">
                  Follow Us on Social Media
                </h2>
                <p className="text-brand-gray mb-6">
                  Stay updated with our latest styles, promotions, and beauty tips. 
                  Follow us on Instagram and TikTok for more.
                </p>
                <div className="flex gap-4">
                  <a
                    href={SOCIALS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-brand-white px-6 py-4 rounded-premium shadow-card hover:shadow-card-hover transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href={SOCIALS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-brand-white px-6 py-4 rounded-premium shadow-card hover:shadow-card-hover transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.008 4.008 0 01-3.742-3.741 2.251 2.251 0 00-2.889-1.262 4.005 4.005 0 01-3.798 2.355 2.255 2.255 0 00-2.253 1.432 4.004 4.004 0 01-3.876-4.163 2.256 2.256 0 00-1.924-1.4 4.004 4.004 0 01-3.927-4.215 2.255 2.255 0 00-2.241-1.187A4.01 4.01 0 016.7.285a2.255 2.255 0 001.889 1.3 4.003 4.003 0 013.792 2.418 2.255 2.255 0 002.253 1.373 4.002 4.002 3.927 4.214 2.256 2.256 0 001.873 1.383 4.004 4.004 0 013.927 4.215A2.255 2.255 0 0018.3 13.58a4.003 4.003 0 013.875 4.163A2.256 2.256 0 0021.7 17.9a4.005 4.005 0 01-2.101 4.215A2.255 2.255 0 0021.7 22.17v-3.578a2.244 2.244 0 001.342-2.009 4.01 4.01 0 01-2.092-3.608 2.245 2.245 0 001.473-1.919z" />
                    </svg>
                    <span className="font-medium">TikTok</span>
                  </a>
                </div>
              </div>

              {/* Products */}
              <div>
                <h2 className="font-heading text-2xl text-brand-black mb-6">
                  Our Products
                </h2>
                <p className="text-brand-gray mb-6">
                  We offer a wide variety of premium wigs and hair extensions. 
                  Click to learn more about any product.
                </p>
                <div className="flex flex-wrap gap-3">
                  {PRODUCTS.map((product) => (
                    <span
                      key={product.id}
                      className="bg-brand-white px-4 py-2 rounded-full text-sm"
                    >
                      {product.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Map Placeholder */}
        <Section background="cream" padding="lg">
          <Container>
            <div className="bg-brand-sand rounded-premium-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-brand-taupe mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-brand-charcoal font-medium">Map Placeholder</p>
                <p className="text-brand-taupe text-sm">{CONTACT.location}</p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}