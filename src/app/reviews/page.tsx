import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CONTACT } from '@/constants/brand';

/**
 * Reviews Page - Minimal Clean Design
 * Light, airy, elegant aesthetic
 */
export default function ReviewsPage() {
  const reviews = [
    {
      name: "Sarah M.",
      location: "Accra",
      rating: 5,
      title: "Amazing quality!",
      text: "The quality is amazing! My lace front wig looks so natural. Everyone asks where I got it from. I've been wearing it for months and it still looks brand new.",
      date: "2 weeks ago"
    },
    {
      name: "Grace K.",
      location: "Kumasi",
      rating: 5,
      title: "Excellent service",
      text: "Fast delivery and excellent customer service. They helped me choose the perfect style for my face shape. Will definitely be ordering more!",
      date: "1 month ago"
    },
    {
      name: "Miriam A.",
      location: "Tema",
      rating: 5,
      title: "Highly recommended",
      text: "Affordable prices for such premium quality. I've recommended Affordable Wigs Gh to all my friends! The color I got matches perfectly with my natural hair.",
      date: "1 month ago"
    },
    {
      name: "Adjoa S.",
      location: "Accra",
      rating: 5,
      title: "Worth every cedis",
      text: "I was hesitant at first but after receiving my wig, I'm so glad I chose them. The hair is soft, the lace is undetectable, and it blends perfectly with my scalp.",
      date: "2 months ago"
    },
    {
      name: "Yaa D.",
      location: "Takoradi",
      rating: 5,
      title: "Perfect for beginners",
      text: "This was my first time buying a wig online and the experience was seamless. They answered all my questions and even gave me tips on how to maintain it.",
      date: "2 months ago"
    },
    {
      name: "Felicia O.",
      location: "Cape Coast",
      rating: 4,
      title: "Great experience",
      text: "Great quality wigs at affordable prices. Delivery was faster than expected. The only reason for 4 stars is I wish they had more colors to choose from.",
      date: "3 months ago"
    }
  ];

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
              Testimonials
            </p>
            <h1 className="text-4xl md:text-5xl font-normal text-[#0a0a0a] mb-6">
              Customer <span className="text-[#d4a853]">Reviews</span>
            </h1>
            <p className="text-lg text-[#525252]">
              See what our customers have to say about their experience with us
            </p>
          </div>
        </Container>
      </section>

      {/* Reviews Stats - Clean Grid */}
      <Section padding="large">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-[#faf9f7] rounded-lg">
              <div className="text-4xl md:text-5xl font-normal text-[#d4a853] mb-2">200+</div>
              <p className="text-[#737373] font-medium">Happy Customers</p>
            </div>
            <div className="p-6 bg-[#faf9f7] rounded-lg">
              <div className="text-4xl md:text-5xl font-normal text-[#d4a853] mb-2">4.9</div>
              <p className="text-[#737373] font-medium">Average Rating</p>
            </div>
            <div className="p-6 bg-[#faf9f7] rounded-lg">
              <div className="text-4xl md:text-5xl font-normal text-[#d4a853] mb-2">50+</div>
              <p className="text-[#737373] font-medium">5-Star Reviews</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Reviews List - Clean Grid */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#d4a853] tracking-[0.2em] uppercase mb-3">
              Feedback
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a]">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < review.rating ? "text-[#d4a853]" : "text-gray-200"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                {/* Review Title */}
                <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                  {review.title}
                </h3>
                
                {/* Review Text */}
                <p className="text-[#737373] mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-[#0a0a0a]">{review.name}</p>
                    <p className="text-sm text-[#a3a3a3]">{review.location}</p>
                  </div>
                  <p className="text-xs text-[#a3a3a3]">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust CTA - Light & Clean */}
      <Section padding="xlarge">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal text-[#0a0a0a] mb-4">
              Want to Share Your Experience?
            </h2>
            <p className="text-[#525252] mb-8">
              Have you purchased from us? We'd love to hear about your experience! 
              Chat with us to share your thoughts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" size="lg">
                  Share Your Review
                </Button>
              </a>
              <Link href="/services">
                <Button variant="secondary" size="lg" className="border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}