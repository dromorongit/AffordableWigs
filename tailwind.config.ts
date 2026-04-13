import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium luxury beauty brand colors
        brand: {
          white: "#FFFFFF",
          cream: "#FDFBF7",
          ivory: "#FAF8F5",
          sand: "#F5F0EB",
          nude: "#E8E0D8",
          taupe: "#8B8578",
          gold: "#C9A962",
          "gold-light": "#D4BC7D",
          "gold-dark": "#B39548",
          black: "#1A1A1A",
          charcoal: "#2D2D2D",
          gray: "#6B6B6B",
          "light-gray": "#F0F0F0",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        accent: ["Cormorant Garamond", "serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      boxShadow: {
        "premium": "0 4px 20px rgba(0, 0, 0, 0.06)",
        "premium-hover": "0 8px 30px rgba(0, 0, 0, 0.1)",
        "card": "0 2px 12px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "premium": "12px",
        "premium-sm": "8px",
        "premium-lg": "16px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-up-delay": "slideUp 0.6s ease-out 0.2s forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;