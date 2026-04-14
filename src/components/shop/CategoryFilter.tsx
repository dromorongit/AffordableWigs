"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ICategoryPopulated } from "@/types/product";

interface CategoryFilterProps {
  categories: ICategoryPopulated[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const createCategoryUrl = useCallback(
    (categorySlug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categorySlug) {
        params.set("category", categorySlug);
      } else {
        params.delete("category");
      }
      params.delete("page"); // Reset to page 1 when changing category
      return `/shop?${params.toString()}`;
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-heading text-sm text-text-primary uppercase tracking-wide mb-3">
        Categories
      </h3>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href={createCategoryUrl(null)}
            className={`block text-sm py-2 px-3 rounded-premium-sm transition-all duration-200 ${
              !activeCategory
                ? "bg-primary text-white"
                : "text-text-light hover:text-primary hover:bg-background-sand"
            }`}
          >
            All Products
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id.toString()}>
            <Link
              href={createCategoryUrl(category.slug)}
              className={`block text-sm py-2 px-3 rounded-premium-sm transition-all duration-200 ${
                activeCategory === category.slug
                  ? "bg-primary text-white"
                  : "text-text-light hover:text-primary hover:bg-background-sand"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;
