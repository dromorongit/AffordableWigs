import { Container, Section } from "@/components/ui";

interface ShopHeroProps {
  title?: string;
  subtitle?: string;
}

export function ShopHero({ 
  title = "Our Collection", 
  subtitle = "Discover premium wigs, bundles, closures, and frontals crafted for your beauty." 
}: ShopHeroProps) {
  return (
    <Section background="cream" padding="md">
      <Container>
        <div className="text-center py-8 md:py-12">
          <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
            Premium Quality
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4">
            {title}
          </h1>
          <p className="font-body text-text-light text-lg md:text-xl max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default ShopHero;
