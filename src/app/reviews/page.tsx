import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";
import { TESTIMONIALS, CONTACT, PAGE_METADATA } from "@/constants";

export const metadata: Metadata = {
  title: PAGE_METADATA.reviews.title,
  description: PAGE_METADATA.reviews.description,
};

export default function ReviewsPage() {
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
                  Customer Reviews
                </span>
                <h1 className="font-heading text-4xl md:text-5xl text-brand-black mb-6">
                  What Our Customers Say
                </h1>
                <p className="text-brand-gray text-lg leading-relaxed">
                  Don't just take our word for it. Here's what our amazing customers 
                  have to say about their experience with Affordable Wigs Gh.
                </p>
              </div>
            </Container>
          </div>
        </Section>

        {/* All Reviews */}
        <Section background="white" padding="lg">
          <Container>
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 p-8 bg-brand-cream rounded-premium-lg">
              <div className="text-center">
                <div className="font-heading text-5xl text-brand-black">4.9</div>
                <div className="flex gap-1 justify-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-brand-gray">Based on {TESTIMONIALS.length * 10}+ reviews</p>
              </div>
              <div className="hidden md:block w-px h-20 bg-brand-nude" />
              <p className="text-brand-gray text-center max-w-md">
                Join hundreds of satisfied customers who have found their perfect look with us. 
                We're committed to making every customer feel beautiful and confident.
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-brand-white rounded-premium p-6 md:p-8 shadow-card"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-brand-gold"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-brand-gray leading-relaxed mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center">
                      <span className="font-heading text-brand-charcoal">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-brand-black text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-brand-taupe text-xs">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Placeholder Reviews */}
              {[...Array(3)].map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="bg-brand-white rounded-premium p-6 md:p-8 shadow-card"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-brand-gold"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-brand-gray leading-relaxed mb-6">
                    &ldquo;Amazing quality and service! The wig I purchased exceeded my expectations. 
                    Will definitely be coming back for more.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center">
                      <span className="font-heading text-brand-charcoal">C</span>
                    </div>
                    <div>
                      <p className="font-medium text-brand-black text-sm">
                        Customer {index + 4}
                      </p>
                      <p className="text-brand-taupe text-xs">Ghana</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="black" padding="lg">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl text-brand-white mb-6">
                Share Your Experience
              </h2>
              <p className="text-brand-light-gray mb-8">
                Have you purchased from us? We'd love to hear about your experience. 
                Chat with us to leave a review.
              </p>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}