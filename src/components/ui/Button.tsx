import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-black text-brand-white hover:bg-brand-charcoal active:bg-brand-black shadow-premium hover:shadow-premium-hover",
    secondary: "bg-brand-gold text-brand-white hover:bg-brand-gold-dark active:bg-brand-gold-dark shadow-premium hover:shadow-premium-hover",
    outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-white",
    ghost: "text-brand-black hover:bg-brand-light-gray",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}