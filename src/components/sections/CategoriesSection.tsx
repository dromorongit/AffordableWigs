import Link from "next/link";
import { Container, Section } from "@/components/ui";
import { getCategories } from "@/lib/products";

// Revalidate every 60 seconds to ensure fresh category data
export const revalidate = 60;

export async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <Section background="white" padding="lg">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-accent text-sm tracking-widest uppercase mb-4">
            Our Collection
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
            Browse by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            // Category images mapping with cache-busting
            const categoryImages: Record<string, string> = {
              "ready-to-wear-wigs": "/images/readywigs.jpg?v=20260416",
              "wig-bundles": "/images/wigbundles.jpg?v=20260416",
              "closures": "/images/closure.jpg",
              "frontals": "/images/frontal.jpg",
            };
            
            const imageUrl = categoryImages[category.slug] || "";
            
            return (
              <Link
                key={category._id.toString()}
                href={`/shop?category=${category.slug}`}
                className="group"
              >
                <div className="relative aspect-square rounded-premium overflow-hidden transition-all duration-500 group-hover:shadow-premium-hover">
                  {/* Category Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-background-sand to-background-ivory" />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Bottom Label */}
                  <div className="absolute bottom-0 left-0 right-0 py-4 px-4 text-center">
                    <h3 className="font-heading text-base text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default CategoriesSection;
