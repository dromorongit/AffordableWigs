"use client";

import React, { useState, useEffect } from "react";
import { BRAND } from "@/constants";

interface StylingOption {
  _id: string;
  name: string;
  price: number;
}

interface StylingSelectorProps {
  value: string;
  onChange: (stylingType: string, stylingName: string, stylingPrice: number) => void;
  disabled?: boolean;
}

export function StylingSelector({ value, onChange, disabled }: StylingSelectorProps) {
  const [options, setOptions] = useState<StylingOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/styling-services")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setOptions(data.services || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">Choose Styling</label>
        <div className="text-sm text-gray-400">Loading styling options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        Choose Styling
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option: StylingOption) => {
          const isSelected = value === option._id;
          return (
            <button
              key={option._id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option._id, option.name, option.price)}
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
