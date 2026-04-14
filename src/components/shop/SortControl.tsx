"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PRODUCT_SORT_OPTIONS } from "@/lib/products";

export function SortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "-createdAt";

  const createSortUrl = useCallback(
    (sortValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sortValue);
      params.delete("page"); // Reset to page 1 when changing sort
      return `/shop?${params.toString()}`;
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-heading text-sm text-text-primary uppercase tracking-wide mb-3">
        Sort By
      </h3>
      <select
        value={currentSort}
        onChange={(e) => router.push(createSortUrl(e.target.value))}
        className="w-full px-4 py-3 text-sm bg-background border border-neutral-nude rounded-premium-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortControl;
