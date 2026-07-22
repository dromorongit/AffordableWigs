import { Container, Section } from "@/components/ui";

export default function Loading() {
  return (
    <Section background="cream" padding="lg">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="h-4 w-24 bg-neutral-nude/30 rounded mb-4 animate-pulse" />
            <div className="h-8 w-64 bg-neutral-nude/30 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-neutral-nude/30 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-background rounded-premium overflow-hidden">
              <div className="aspect-[3/4] bg-neutral-nude/20 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-neutral-nude/20 rounded animate-pulse" />
                <div className="h-4 w-full bg-neutral-nude/20 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-neutral-nude/20 rounded animate-pulse" />
                <div className="h-5 w-24 bg-neutral-nude/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
