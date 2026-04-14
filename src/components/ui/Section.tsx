interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "cream" | "ivory" | "sand" | "black";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className = "",
  background = "white",
  padding = "lg",
}: SectionProps) {
  const backgrounds = {
    white: "bg-background",
    cream: "bg-background-cream",
    ivory: "bg-background-ivory",
    sand: "bg-background-sand",
    black: "bg-text-primary",
  };

  const paddings = {
    none: "py-0",
    sm: "py-8 md:py-10",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-22 lg:py-26",
    xl: "py-22 md:py-26 lg:py-30",
  };

  return (
    <section className={`${backgrounds[background]} ${paddings[padding]} ${className}`}>
      {children}
    </section>
  );
}