import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/constants/brand';
import './globals.css';

// Load Google Fonts
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Root Layout with SEO metadata and global fonts
 * Provides the base layout structure for the entire application
 */
export const metadata: Metadata = {
  title: {
    default: SEO.title,
    template: `%s | ${SEO.title}`,
  },
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: SEO.siteName }],
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: SEO.siteName,
    locale: 'en-GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
    creator: SEO.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-[72px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}