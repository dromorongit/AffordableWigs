"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND, CONTACT } from "@/constants";
import { Container, Button, Section } from "@/components/ui";

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

export function HeroSection() {
  return (
    <Section background="cream" padding="none" className="pt-20">
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 max-w-xl">
              <span className="inline-block text-primary font-accent text-lg tracking-widest uppercase mb-4">
                Premium Wigs in Ghana
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight mb-6">
                {BRAND.tagline}
              </h1>
              <p className="text-text-light text-lg leading-relaxed mb-8">
                {BRAND.description}. Discover our stunning collection of premium wigs, bundles, closures, and frontals designed to make you look and feel absolutely stunning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button variant="primary" size="lg">
                    Explore Collection
                  </Button>
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-neutral-nude">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <span className="block font-heading text-2xl text-text-primary"><AnimatedCounter target={500} suffix="+" /> </span>
                    <span className="text-text-light text-sm">Happy Customers</span>
                  </div>
                  <div>
                    <span className="block font-heading text-2xl text-text-primary"><AnimatedCounter target={4} suffix=".9" /> </span>
                    <span className="text-text-light text-sm">Star Rating</span>
                  </div>
                  <div>
                    <span className="block font-heading text-2xl text-text-primary"><AnimatedCounter target={50} suffix="+" /> </span>
                    <span className="text-text-light text-sm">Wig Styles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual Content */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/5] max-w-lg mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  alt="Premium wigs and hair extensions"
                  className="w-full h-full object-cover rounded-premium-lg shadow-xl"
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary/30 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}