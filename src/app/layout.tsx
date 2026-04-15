import type { Metadata } from "next";
import "./globals.css";
import { BRAND, PAGE_METADATA } from "@/constants";
import { CartProvider } from "@/context/CartContext";
import { CartDrawerProvider } from "@/components/providers/CartDrawerProvider";
import { ToastProvider } from "@/components/ui";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://affordablewigsgh.com";

export const metadata: Metadata = {
  title: {
    default: PAGE_METADATA.home.title,
    template: `%s | ${BRAND.name}`,
  },
  description: PAGE_METADATA.home.description,
  keywords: ["wigs", "wig Ghana", "hair extensions", "beauty", "premium wigs", "affordable wigs"],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/affordablelogo.jpg",
  },
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: BASE_URL,
    siteName: BRAND.name,
    title: PAGE_METADATA.home.title,
    description: PAGE_METADATA.home.description,
    images: [
      {
        url: `${BASE_URL}/images/affordablelogo.jpg`,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_METADATA.home.title,
    description: PAGE_METADATA.home.description,
    images: [`${BASE_URL}/images/affordablelogo.jpg`],
    creator: "@affordablewigsgh",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <CartDrawerProvider />
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}