import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/constants/brand';
import './globals.css';

// Load Google Fonts - Elegant editorial typography
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
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
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
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