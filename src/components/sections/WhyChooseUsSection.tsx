import { WHY_CHOOSE_US } from "@/constants";
import { Container, Section } from "@/components/ui";

export function WhyChooseUsSection() {
  return (
    <Section background="ivory" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
            Why Choose Us
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
            The Affordable Wigs Gh Difference
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((feature) => (
            <div
              key={feature.id}
              className="text-center"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {feature.icon === "star" && (
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  )}
                  {feature.icon === "heart" && (
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  )}
                  {feature.icon === "sparkles" && (
                    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                  )}
                  {feature.icon === "truck" && (
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-6-6zm2 7h-4l2-2h4l-2 2zm-8 5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                  )}
                </svg>
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-light text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}