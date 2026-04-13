import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  ServicesSection,
  WhyChooseUsSection,
  TestimonialsPreviewSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <WhyChooseUsSection />
        <ServicesSection />
        <TestimonialsPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}