import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LuxuryCard } from '@/components/ui/LuxuryCard';

/**
 * Reviews Page
 * Customer testimonials and reviews - full implementation in Phase 2
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
      {/* Hero Section */}
      <Section background="dark" padding="large">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Customer Reviews
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our customers have to say about their experience with us
            </p>
          </div>
        </Container>
      </Section>

      {/* Reviews Stats */}
      <Section padding="small" background="cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#d4a853] mb-2">200+</div>
              <p className="text-[#525252]">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#d4a853] mb-2">4.9</div>
              <p className="text-[#525252]">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#d4a853] mb-2">50+</div>
              <p className="text-[#525252]">5-Star Reviews</p>
            </div>
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

      {/* Write Review CTA */}
      <Section background="gold-light">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#0a0a0a] mb-4">
              Share Your Experience
            </h2>
            <p className="text-[#525252] mb-8">
              Have you purchased from us? We'd love to hear about your experience! 
              Leave a review and help other women make informed decisions.
            </p>
            <Button variant="primary" size="lg">
              Write a Review
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}