import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/**
 * 404 Not Found Page
 * Displayed when a user visits a non-existent page
 */
export default function NotFound() {
  return (
    <Section className="min-h-[60vh] flex items-center">
      <Container>
        <div className="text-center">
          <div className="text-8xl mb-6">😔</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-[#525252] mb-8 max-w-lg mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button variant="primary">
                Go Back Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="secondary">
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}