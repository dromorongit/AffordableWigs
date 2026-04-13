"use client";

import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { CategoryFilter } from "./CategoryFilter";
import { SortControl } from "./SortControl";
import { SearchBar } from "./SearchBar";
import { ICategoryPopulated } from "@/types/product";

interface FilterBarProps {
  categories: ICategoryPopulated[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-brand-white border border-brand-nude rounded-premium-sm w-full justify-center"
        >
          <FiFilter className="w-5 h-5" />
          <span className="text-sm font-medium">Filters & Sort</span>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-brand-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-brand-sand rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <SearchBar />
                <CategoryFilter categories={categories} />
                <SortControl />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-8">
          <SearchBar />
          <CategoryFilter categories={categories} />
          <SortControl />
        </div>
      </div>
    </>
  );
}

export default FilterBar;
