import Link from "next/link";
import { Button } from "@/components/ui";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No products found",
  message = "We couldn't find any products matching your criteria. Try adjusting your filters or search terms.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <div className="w-20 h-20 mb-6 rounded-full bg-brand-sand flex items-center justify-center">
        <svg
          className="w-10 h-10 text-brand-taupe"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="font-heading text-xl md:text-2xl text-brand-black mb-2">
        {title}
      </h3>
      <p className="text-brand-gray text-center max-w-md mb-8">
        {message}
      </p>
      <Link href="/shop">
        <Button variant="primary" size="md">
          Clear Filters
        </Button>
      </Link>
    </div>
  );
}

export default EmptyState;
