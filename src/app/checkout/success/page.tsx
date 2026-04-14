"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BRAND, CONTACT } from "@/constants";
import { Container, Section, Button } from "@/components/ui";

interface OrderDetails {
  orderNumber: string;
  total: number;
  customer: {
    fullName: string;
    email: string;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const reference = searchParams.get("reference");
  const orderNumber = searchParams.get("order");

  useEffect(() => {
    // If no reference, redirect to home
    if (!reference) {
      router.push("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference, orderNumber }),
        });

        const data = await response.json();

        if (!response.ok) {
          setVerificationError(data.message || "Payment verification failed");
          setIsVerifying(false);
          return;
        }

        if (data.success && data.order) {
          setOrderDetails({
            orderNumber: data.order.orderNumber,
            total: data.order.total,
            customer: {
              fullName: data.order.customer.fullName,
              email: data.order.customer.email,
            },
          });

          // Clear the cart after successful payment
          clearCart();
        } else {
          setVerificationError(data.message || "Unable to verify order");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationError("An error occurred during verification");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [reference, orderNumber, router, clearCart]);

  return (
    <main className="pt-20">
      <Section background="cream" padding="lg">
        <Container>
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 animate-spin text-brand-gold mb-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <h1 className="font-heading text-2xl text-brand-black mb-4">
                Verifying Payment...
              </h1>
              <p className="text-brand-gray">
                Please wait while we verify your payment.
              </p>
            </div>
          ) : verificationError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 text-red-500 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h1 className="font-heading text-2xl text-brand-black mb-4">
                Payment Issue
              </h1>
              <p className="text-brand-gray mb-6 max-w-md">{verificationError}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/checkout" className="px-6 py-3 bg-brand-black text-brand-white rounded-premium font-medium hover:bg-brand-charcoal transition-colors">
                  Try Again
                </Link>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-brand-black text-brand-black rounded-premium font-medium hover:bg-brand-black hover:text-brand-white transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="font-heading text-3xl md:text-4xl text-brand-black mb-4">
                Order Confirmed!
              </h1>

              <p className="text-brand-gray text-lg mb-8">
                Thank you for your purchase, {orderDetails?.customer.fullName}!
              </p>

              {/* Order Details Card */}
              <div className="w-full bg-brand-white rounded-premium p-6 border border-brand-light-gray mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-brand-light-gray">
                    <span className="text-brand-gray">Order Number</span>
                    <span className="font-medium text-brand-black">
                      {orderDetails?.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-gray">Amount Paid</span>
                    <span className="text-xl font-medium text-brand-black">
                      {BRAND.currencySymbol}
                      {orderDetails?.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Email Note */}
              <p className="text-sm text-brand-gray mb-8">
                A confirmation email will be sent to{" "}
                <span className="font-medium text-brand-black">
                  {orderDetails?.customer.email}
                </span>
              </p>

              {/* WhatsApp Support */}
              <div className="w-full bg-brand-sand/30 rounded-premium p-6 mb-8">
                <h3 className="font-heading text-lg text-brand-black mb-2">
                  Need Help?
                </h3>
                <p className="text-brand-gray text-sm mb-4">
                  Have questions about your order? Chat with us on WhatsApp.
                </p>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-black transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.964-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.174-.149.446-.48.596-.707.149-.174.198-.298.297-.496.099-.198.05-.371-.025-.52-.074-.15-.671-1.621-.919-2.206-.238-.537-.476-.436-.648-.437-.149-.016-.32-.023-.472-.015-.099.008-.24.015-.347.015-.107 0-.29.074-.442.371-.149.297-.513 1.002-.563 1.075-.049.074-.197.199-.398.298-.197.074-.417.099-.596.024-.174-.074-.696-.294-1.328-.936-.644-.654-1.075-1.463-1.202-1.709-.124-.248-.013-.395.093-.523.104-.124.248-.297.347-.446.099-.149.198-.298.297-.447.099-.149.173-.298.347-.447.174-.149.397-.149.595-.074.198.074.793.397.954.793.174.397.595.793.952 1.058.347.248.793.595 1.328.794.298.099.595.198.795.198.198 0 .446-.074.643-.248zm-3.673-4.835c-.074-.124-.174-.225-.397-.397-.223-.174-.496-.248-.793-.248-.297 0-.595.074-.843.223-.248.149-.446.347-.595.595-.149.248-.223.496-.223.793 0 .297.074.595.223.843.149.248.347.446.595.595.248.149.546.223.843.223.297 0 .595-.074.843-.223.248-.149.446-.347.595-.595.149-.248.223-.546.223-.843 0-.297-.074-.595-.223-.843-.149-.248-.347-.446-.595-.595-.248-.149-.546-.223-.843-.223-.297 0-.57.074-.793.248-.223.172-.347.273-.397.372zm5.484-6.625c-.099-.198-.198-.347-.297-.496-.099-.149-.248-.223-.397-.347-.149-.099-.322-.149-.495-.074-.173.074-.32.198-.446.347-.124.149-.198.322-.173.495.024.173.124.347.248.495.124.149.223.297.347.397.124.099.272.173.446.248l.272.173c.298.124.595.273.843.495.248.223.471.495.595.843.124.347.149.67.074 1.024-.074.347-.248.695-.546.943-.297.248-.645.446-1.073.546-.124.025-.248.025-.347.025-.124 0-.272 0-.396-.025-.124-.025-.223-.074-.347-.124-.124-.049-.223-.124-.297-.198-.074-.074-.173-.149-.248-.223-.074-.074-.173-.124-.272-.149-.099-.025-.173-.025-.272-.025-.099 0-.198.025-.297.074-.099.049-.173.124-.248.223-.074.099-.124.198-.149.347-.024.149-.024.272 0 .421.024.149.074.297.149.446.074.149.173.297.297.421.124.124.272.223.446.297.173.074.372.124.545.124.099 0 .223-.025.32-.074.099-.049.198-.149.272-.248.074-.099.124-.173.149-.272.024-.099.024-.173.024-.272-.025-.595-.173-1.166-.446-1.66-.273-.495-.669-.918-1.166-1.257-.495-.347-1.073-.595-1.66-.769l-1.63-.446c-.495-.124-.967-.173-1.413-.173-.446 0-.867.074-1.257.223-.397.149-.769.371-1.073.669-.322.297-.557.595-.743.992-.173.372-.272.768-.297 1.19-.025.421.025.867.173 1.313.149.447.372.867.669 1.257.297.397.669.743 1.124.992.454.248 1.008.421 1.66.173.595-.223 1.166-.495 1.66-.793.495-.297.918-.595 1.257-.867.347-.272.595-.546 1.073-.793.477-.248.893-.347 1.257-.347.372-.024.767.124 1.19.421z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  href="/shop"
                  className="flex-1 px-6 py-3 bg-brand-black text-brand-white text-center rounded-premium font-medium hover:bg-brand-charcoal transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 border border-brand-black text-brand-black text-center rounded-premium font-medium hover:bg-brand-black hover:text-brand-white transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="pt-20">
      <Section background="cream" padding="lg">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="w-16 h-16 animate-spin text-brand-gold mb-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <h1 className="font-heading text-2xl text-brand-black mb-4">
              Loading...
            </h1>
          </div>
        </Container>
      </Section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}