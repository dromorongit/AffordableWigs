import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";
import { CONTACT, SOCIALS, PRODUCTS, PAGE_METADATA } from "@/constants";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaInstagram, FaTiktok } from "react-icons/fa";

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
                  <FaWhatsapp className="w-8 h-8 text-brand-gold" />
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
                  <FaPhone className="w-8 h-8 text-brand-gold" />
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
                  <FaMapMarkerAlt className="w-8 h-8 text-brand-gold" />
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
                    <FaInstagram className="w-6 h-6" />
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href={SOCIALS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-brand-white px-6 py-4 rounded-premium shadow-card hover:shadow-card-hover transition-all"
                  >
                    <FaTiktok className="w-6 h-6" />
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
                <FaMapMarkerAlt className="w-16 h-16 text-brand-taupe mx-auto mb-4" />
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