import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  BestSellerProductsSection,
  NewArrivalProductsSection,
  WhyChooseUsSection,
  TestimonialsPreviewSection,
  ServicesSection,
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
        <BestSellerProductsSection />
        <NewArrivalProductsSection />
        <WhyChooseUsSection />
        <TestimonialsPreviewSection />
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
