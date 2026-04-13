"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const createSearchUrl = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset to page 1 when searching
      return `/shop?${params.toString()}`;
    },
    [searchParams]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(createSearchUrl(searchValue.trim()));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-12 text-sm bg-brand-white border border-brand-nude rounded-premium-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
        />
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-gold transition-colors"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
