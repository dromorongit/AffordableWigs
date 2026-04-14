import type { Metadata } from "next";
import "./globals.css";
import { BRAND, PAGE_METADATA } from "@/constants";
import { CartProvider } from "@/context/CartContext";
import { CartDrawerProvider } from "@/components/providers/CartDrawerProvider";

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
    icon: "/assets/images/affordablelogo.jpg",
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
          {children}
        </CartProvider>
      </body>
    </html>
  );
}