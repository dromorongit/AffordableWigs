/**
 * Brand Constants for Affordable Wigs Gh
 * Centralized configuration for brand information, colors, and settings
 */

// Brand Information
export const BRAND = {
  name: 'Affordable Wigs Gh',
  tagline: 'Locks of luxury, affordable prices',
  description: 'Treats your hair to the best without breaking the bank',
  businessType: 'Wig sales and wig styling brand in Ghana',
  country: 'Ghana',
} as const;

// Currency Configuration
export const CURRENCY = {
  code: 'GHS',
  symbol: 'GH₵',
  name: 'Ghana Cedis',
} as const;

// Products and Services
export const PRODUCTS = [
  'Ready-to-Wear Wigs',
  'Wig Bundles',
  'Closures',
  'Frontals',
] as const;

export const SERVICES = [
  'Styling of Wigs',
  'Selling of Wigs',
] as const;

// Contact Information
export const CONTACT = {
  phone: '0242711007',
  whatsapp: '0242711007',
  whatsappLink: 'https://wa.me/233242711007',
  location: 'Ashongman Estate, Calvary Chapel International area, Ghana',
  email: '',
} as const;

// Social Media Links
export const SOCIALS = {
  instagram: 'https://www.instagram.com/affordable__wigs?igsh=cDd6YTh2NHRkaWY%3D&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@affordable_wigs_gh?_r=1&_t=ZS-95V4JvBQBpE',
  facebook: '',
  youtube: '',
} as const;

// Brand Colors (CSS variable references)
export const COLORS = {
  primary: {
    main: '#0a0a0a',
    light: '#1a1a1a',
    dark: '#000000',
  },
  gold: {
    main: '#d4a853',
    light: '#e8c87a',
    dark: '#b8923d',
    muted: '#c9a74a',
  },
  neutral: {
    white: '#ffffff',
    offWhite: '#fafafa',
    cream: '#f5f3ef',
    silver: '#e5e5e5',
    gray100: '#f3f3f3',
    gray200: '#e5e5e5',
    gray300: '#d4d4d4',
    gray400: '#a3a3a3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',
  },
} as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
] as const;

// Default SEO Metadata
export const SEO: {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle: string;
} = {
  siteName: 'Affordable Wigs Gh',
  title: 'Affordable Wigs Gh',
  description: 'Luxury wigs at affordable prices in Ghana. Shop ready-to-wear wigs, wig bundles, closures, frontals, and professional wig styling services.',
  keywords: [
    'wigs Ghana',
    'affordable wigs',
    'luxury wigs',
    'wig bundles',
    'closures',
    'frontals',
    'wig styling Ghana',
    'human hair wigs',
  ],
  ogImage: '/og-image.jpg',
  twitterHandle: '@affordable_wigs_gh',
};

// Payment Gateway (for future phases)
export const PAYMENT = {
  gateway: 'Paystack',
  currency: 'GHS',
} as const;

// Deployment Configuration
export const DEPLOYMENT = {
  platform: 'Railway',
  database: 'Railway MongoDB',
} as const;

// Feature Flags (for future implementation)
export const FEATURES = {
  cart: false,
  checkout: false,
  payments: false,
  admin: false,
  auth: false,
  reviews: false,
  productManagement: false,
} as const;

// Animation Delays
export const ANIMATION = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
} as const;

// Container Sizes
export const CONTAINER = {
  maxWidth: '1280px',
  padding: '1.5rem',
} as const;

// Spacing Scale
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const;

// Border Radius
export const RADIUS = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
} as const;

// Breakpoints (matching Tailwind default)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;