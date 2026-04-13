import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CONTACT, SOCIALS, BRAND } from '@/constants/brand';

/**
 * Contact Page - Modern Simple Design
 * Clean, light, conversion-focused aesthetic
 */
export default function ContactPage() {
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
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-normal text-[#0a0a0a] mb-6">
              Contact <span className="text-[#d4a853]">{BRAND.name}</span>
            </h1>
            <p className="text-lg text-[#525252]">
              Have questions? We'd love to hear from you. Reach out through any channel below.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Options - Clean Grid */}
      <Section padding="large">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="text-center p-6 bg-[#faf9f7] rounded-lg">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">Phone</h3>
              <p className="text-sm text-[#737373] mb-3">
                Mon - Sat: 9am - 6pm
              </p>
              <a 
                href={`tel:${CONTACT.phone}`}
                className="text-[#d4a853] font-medium hover:underline"
              >
                {CONTACT.phone}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="text-center p-6 bg-[#faf9f7] rounded-lg">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">WhatsApp</h3>
              <p className="text-sm text-[#737373] mb-3">
                Quick responses
              </p>
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4a853] font-medium hover:underline"
              >
                Chat with us
              </a>
            </div>

            {/* Location */}
            <div className="text-center p-6 bg-[#faf9f7] rounded-lg">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">Visit Us</h3>
              <p className="text-sm text-[#737373] mb-3">
                Our location in Accra
              </p>
              <p className="text-[#0a0a0a] text-sm">
                {CONTACT.location}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Form Placeholder - Clean */}
      <Section background="cream" padding="large">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
                Message
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
                Send Us a Message
              </h2>
              <p className="text-[#737373] mt-3">
                For faster response, reach out to us on WhatsApp
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#525252] mb-2">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 bg-[#faf9f7] border-0 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:ring-offset-2"
                      placeholder="Enter your name"
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#525252] mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 bg-[#faf9f7] border-0 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:ring-offset-2"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#525252] mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 bg-[#faf9f7] border-0 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:ring-offset-2"
                    placeholder="Enter your phone number"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#525252] mb-2">
                    Your Message
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-3 bg-[#faf9f7] border-0 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:ring-offset-2"
                    placeholder="How can we help you?"
                    disabled
                  />
                </div>
                
                <Button variant="primary" fullWidth disabled>
                  Send Message (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Social Media - Clean Icons */}
      <Section padding="large">
        <Container>
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              Stay Connected
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              Follow Us on Social Media
            </h2>
            <p className="text-[#737373] mt-3">
              Stay updated with our latest styles and transformations
            </p>
          </div>
          
          <div className="flex justify-center gap-5">
            {SOCIALS.instagram && (
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#faf9f7] rounded-full flex items-center justify-center hover:bg-[#d4a853] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {SOCIALS.tiktok && (
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#faf9f7] rounded-full flex items-center justify-center hover:bg-[#d4a853] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}