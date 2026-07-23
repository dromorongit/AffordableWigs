"use client";

import React from "react";
import { BRAND } from "@/constants";
import { STYLING_OPTIONS, StylingType } from "@/constants";

interface StylingSelectorProps {
  value: string;
  onChange: (stylingType: string, stylingName: string, stylingPrice: number) => void;
  disabled?: boolean;
}

export function StylingSelector({ value, onChange, disabled }: StylingSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        Choose Styling
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STYLING_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id, option.name, option.price)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-premium border-2 transition-all text-center ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-neutral-light bg-background hover:border-primary/40"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-text-primary"}`}>
                {option.name}
              </span>
              {option.price > 0 && (
                <span className={`mt-1 text-xs ${isSelected ? "text-primary-700" : "text-neutral-taupe"}`}>
                  +{BRAND.currencySymbol}{option.price.toLocaleString()}
                </span>
              )}
              {option.price === 0 && (
                <span className={`mt-1 text-xs ${isSelected ? "text-primary-700" : "text-neutral-taupe"}`}>
                  Included
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
