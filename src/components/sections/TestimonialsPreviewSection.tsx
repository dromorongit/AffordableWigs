import Link from "next/link";
import { TESTIMONIALS } from "@/constants";
import { Container, Section, Button } from "@/components/ui";

export function TestimonialsPreviewSection() {
  return (
    <Section background="cream" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
              What Our Customers Say
            </h2>
          </div>
          <Link href="/reviews">
            <Button variant="outline" size="md">
              View All Reviews
            </Button>
          </Link>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background rounded-premium p-6 md:p-8 shadow-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-light leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background-sand flex items-center justify-center">
                  <span className="font-heading text-text-secondary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-neutral-taupe text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}