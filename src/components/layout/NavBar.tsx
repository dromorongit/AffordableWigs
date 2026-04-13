'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS, CONTACT, BRAND } from '@/constants/brand';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

/**
 * NavBar Component - Modern Clean Style
 * Minimal, light, elegant header
 */
export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-white py-5'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-normal tracking-tight text-[#0a0a0a]">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#525252] hover:text-[#d4a853] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* WhatsApp CTA & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* WhatsApp Button - Desktop */}
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex"
            >
              <Button variant="gold" size="sm">
                <span className="mr-2">💬</span>
                Chat
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-[#0a0a0a]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#525252] hover:text-[#d4a853] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <Button variant="gold" fullWidth>
                  <span className="mr-2">💬</span>
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default NavBar;