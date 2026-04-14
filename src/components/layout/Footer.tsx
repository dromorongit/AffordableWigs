import Link from "next/link";
import { BRAND, CONTACT, SOCIALS, NAV_LINKS } from "@/constants";
import { Container, Button } from "@/components/ui";
import { FaInstagram, FaTiktok, FaWhatsapp, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-text-primary text-white py-16 md:py-22">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-2xl font-semibold text-white tracking-tight">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-neutral-light text-sm leading-relaxed mb-6">
              {BRAND.description}
            </p>
            <p className="text-primary font-heading text-lg">
              {BRAND.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-light hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-neutral-light hover:text-white transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span className="text-sm">WhatsApp: {CONTACT.whatsapp}</span>
              </a>
              <p className="flex items-center gap-3 text-neutral-light text-sm">
                <FaPhone className="w-5 h-5" />
                <span>{CONTACT.phone}</span>
              </p>
              <p className="flex items-start gap-3 text-neutral-light text-sm">
                <FaMapMarkerAlt className="w-5 h-5 mt-0.5" />
                <span>{CONTACT.location}</span>
              </p>
            </div>
          </div>

          {/* Social & CTA */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-text-secondary flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-text-secondary flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="md" className="w-full">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-light/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-light text-sm">
              &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <p className="text-neutral-light text-sm">
              Developed with love in Ghana by Dromor Narh. 🇬🇭
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}