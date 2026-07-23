"use client";

import React, { useState, useEffect } from "react";
import { BRAND } from "@/constants";

interface StylingOption {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedDuration?: string;
}

interface StylingSelectorProps {
  value: string;
  onChange: (stylingType: string, stylingName: string, stylingPrice: number, estimatedDuration?: string) => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option: StylingOption) => {
          const isSelected = value === option._id;
          return (
            <button
              key={option._id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option._id, option.name, option.price, option.estimatedDuration)}
              className={`relative flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-200 text-center group hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-gray-200 bg-white hover:border-primary/40"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center animate-in zoom-in">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <span className={`font-semibold text-sm mb-1 transition-colors ${
                isSelected ? "text-primary" : "text-gray-900 group-hover:text-primary"
              }`}>
                {option.name}
              </span>
              {option.description && (
                <span className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {option.description}
                </span>
              )}
              {(option.price > 0 || option._id === "none") && (
                <span className={`mt-2 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                  isSelected ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600 group-hover:bg-primary/5 group-hover:text-primary"
                }`}>
                  {option._id === "none" ? "No Styling" : `+${BRAND.currencySymbol}${option.price.toLocaleString()}`}
                </span>
              )}
              {option.estimatedDuration && option._id !== "none" && (
                <span className={`mt-2 text-xs px-2 py-1 rounded-full transition-colors ${
                  isSelected ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-500 group-hover:bg-primary/5 group-hover:text-primary"
                }`}>
                  {option.estimatedDuration}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
