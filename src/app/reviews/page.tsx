import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Badge } from '@/components/ui/Badge';
import { CONTACT } from '@/constants/brand';

/**
 * Reviews Page
 * Customer testimonials and reviews
 * Phase 2 - Fully implemented with premium luxury branding
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
      {/* Premium Hero Section */}
      <section className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4a853] to-transparent" />
        </div>
        
        <Container>
          <div className="relative z-10 text-center">
            <Badge variant="gold" className="mb-6">
              Testimonials
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Customer <span className="text-[#d4a853]">Reviews</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our customers have to say about their experience with us
            </p>
          </div>
        </Container>
        
        {/* Gold Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />
      </section>

      {/* Reviews Stats */}
      <Section background="cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <LuxuryCard className="text-center py-8">
              <div className="text-4xl md:text-5xl font-bold text-[#d4a853] mb-2">200+</div>
              <p className="text-[#525252] font-medium">Happy Customers</p>
            </LuxuryCard>
            <LuxuryCard className="text-center py-8">
              <div className="text-4xl md:text-5xl font-bold text-[#d4a853] mb-2">4.9</div>
              <p className="text-[#525252] font-medium">Average Rating</p>
            </LuxuryCard>
            <LuxuryCard className="text-center py-8">
              <div className="text-4xl md:text-5xl font-bold text-[#d4a853] mb-2">50+</div>
              <p className="text-[#525252] font-medium">5-Star Reviews</p>
            </LuxuryCard>
          </div>
        </Container>
      </Section>

      {/* Reviews List */}
      <Section>
        <Container>
          <SectionHeading 
            title="What Our Customers Say"
            hasLine
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {reviews.map((review, index) => (
              <LuxuryCard key={index}>
                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < review.rating ? "text-[#d4a853]" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                {/* Review Title */}
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">
                  {review.title}
                </h3>
                
                {/* Review Text */}
                <p className="text-[#525252] mb-4 italic">
                  "{review.text}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-[#0a0a0a]">{review.name}</p>
                    <p className="text-sm text-[#737373]">{review.location}</p>
                  </div>
                  <p className="text-xs text-[#737373]">{review.date}</p>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust CTA */}
      <Section background="dark">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Want to Share Your Experience?
            </h2>
            <p className="text-gray-400 mb-8">
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
                <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white hover:text-[#0a0a0a]">
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