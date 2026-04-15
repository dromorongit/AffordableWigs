/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Increase device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Specify allowed image formats
    formats: ["image/avif", "image/webp"],
  },
  // Production optimizations
  poweredByHeader: false,
  // Compress responses
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Trailing slash for consistent routing
  trailingSlash: false,
};

module.exports = nextConfig;