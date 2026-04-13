// Brand Constants
export const BRAND = {
  name: "Affordable Wigs Gh",
  tagline: "Locks of luxury, affordable prices.",
  description: "Treats your hair to the best without breaking the bank.",
  country: "Ghana",
  currency: "GHS",
  currencySymbol: "GH₵",
} as const;

// Contact Information
export const CONTACT = {
  phone: "0242711007",
  whatsapp: "0242711007",
  whatsappLink: "https://wa.me/233242711007",
  location: "Ashongman Estate, Calvary Chapel International area, Ghana",
  email: "info@affordablewigsgh.com",
} as const;

// Social Links
export const SOCIALS = {
  instagram: "https://www.instagram.com/affordable__wigs?igsh=cDd6YTh2NHRkaWY%3D&utm_source=qr",
  tiktok: "https://www.tiktok.com/@affordable_wigs_gh?_r=1&_t=ZS-95V4JvBQBpE",
} as const;

// Products
export const PRODUCTS = [
  {
    id: "ready-to-wear",
    name: "Ready-to-Wear Wigs",
    description: "Pre-styled wigs ready to wear instantly",
    slug: "ready-to-wear-wigs",
  },
  {
    id: "wig-bundles",
    name: "Wig Bundles",
    description: "Premium hair bundles for custom styling",
    slug: "wig-bundles",
  },
  {
    id: "closures",
    name: "Closures",
    description: "High-quality closures for a natural look",
    slug: "closures",
  },
  {
    id: "frontals",
    name: "Frontals",
    description: "Premium frontals for flawless hairlines",
    slug: "frontals",
  },
] as const;

// Services
export const SERVICES = [
  {
    id: "wig-styling",
    name: "Wig Styling",
    description: "Professional styling to transform your wig into the perfect look",
    icon: "scissors",
  },
  {
    id: "wig-consultation",
    name: "Wig Consultation",
    description: "Expert advice on choosing the perfect wig for your face and lifestyle",
    icon: "chat",
  },
] as const;

// Featured Products (Placeholder data for preview)
export const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Silky Straight wig",
    category: "Ready-to-Wear Wigs",
    price: 850,
    image: "/images/products/wig-1.jpg",
    isFeatured: true,
  },
  {
    id: "2",
    name: "Deep Wave Bundle",
    category: "Wig Bundles",
    price: 650,
    image: "/images/products/wig-2.jpg",
    isFeatured: true,
  },
  {
    id: "3",
    name: "HD Lace Closure",
    category: "Closures",
    price: 350,
    image: "/images/products/wig-3.jpg",
    isFeatured: true,
  },
  {
    id: "4",
    name: "Swiss Lace Frontal",
    category: "Frontals",
    price: 450,
    image: "/images/products/wig-4.jpg",
    isFeatured: true,
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah M.",
    location: "Accra",
    rating: 5,
    text: "Absolutely love my wig! The quality is amazing and it looks so natural. Affordable Wigs Gh exceeded my expectations.",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Grace K.",
    location: "Tema",
    rating: 5,
    text: "Best wig shopping experience ever. The team was so helpful in helping me choose the right style for my face shape.",
    date: "2024-01-10",
  },
  {
    id: "3",
    name: "Michelle A.",
    location: "Kumasi",
    rating: 5,
    text: "I've purchased from several places but Affordable Wigs Gh is by far the best. Great quality, affordable prices.",
    date: "2024-01-05",
  },
] as const;

// Why Choose Us Features
export const WHY_CHOOSE_US = [
  {
    id: "1",
    title: "Premium Quality",
    description: "We source only the finest hair to ensure durability and a natural look.",
    icon: "star",
  },
  {
    id: "2",
    title: "Affordable Luxury",
    description: "Luxury wigs at prices that won't break the bank.",
    icon: "heart",
  },
  {
    id: "3",
    title: "Expert Styling",
    description: "Professional stylists to help you find your perfect look.",
    icon: "sparkles",
  },
  {
    id: "4",
    title: "Nationwide Delivery",
    description: "Fast and reliable delivery across Ghana.",
    icon: "truck",
  },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

// Page Metadata
export const PAGE_METADATA = {
  home: {
    title: "Affordable Wigs Gh - Premium Wigs at Affordable Prices",
    description: "Discover luxury wigs, bundles, closures, and frontals at Affordable Wigs Gh. Premium quality, affordable prices in Ghana.",
  },
  about: {
    title: "About Us - Affordable Wigs Gh",
    description: "Learn about Affordable Wigs Gh - your trusted source for premium wigs in Ghana. Quality wigs at affordable prices.",
  },
  services: {
    title: "Our Services - Affordable Wigs Gh",
    description: "Professional wig styling and consultation services. Let us help you find the perfect look.",
  },
  reviews: {
    title: "Customer Reviews - Affordable Wigs Gh",
    description: "See what our customers say about their experience with Affordable Wigs Gh.",
  },
  contact: {
    title: "Contact Us - Affordable Wigs Gh",
    description: "Get in touch with Affordable Wigs Gh. We're here to help with all your wig needs.",
  },
} as const;