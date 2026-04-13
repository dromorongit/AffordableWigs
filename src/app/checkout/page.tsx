"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { CartItem, CustomerInfo, OrderData } from "@/types/cart";
import { BRAND, PAGE_METADATA, CONTACT } from "@/constants";
import { Container, Section, Button } from "@/components/ui";

// Form field types
interface FormField {
  name: keyof CustomerInfo;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
}

// Form fields configuration
const formFields: FormField[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    type: "tel",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email address",
    type: "email",
    required: true,
  },
  {
    name: "deliveryAddress",
    label: "Delivery Address",
    placeholder: "Enter your delivery address",
    type: "textarea",
    required: true,
  },
  {
    name: "cityOrTown",
    label: "City/Town",
    placeholder: "Enter your city or town",
    type: "text",
    required: true,
  },
  {
    name: "regionOrArea",
    label: "Region/Area",
    placeholder: "Enter your region or area",
    type: "text",
    required: true,
  },
  {
    name: "orderNotes",
    label: "Order Notes (Optional)",
    placeholder: "Any special instructions for delivery?",
    type: "textarea",
    required: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    cityOrTown: "",
    regionOrArea: "",
    orderNotes: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !isSubmitting) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof CustomerInfo]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate phone format (basic)
    if (formData.phone && !/^[\d\s+()-]{8,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize payment
  const initializePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: OrderData = {
        customer: formData,
        items: cart.items,
        subtotal: cart.subtotal,
        total: cart.subtotal, // Could add shipping cost here
        currency: BRAND.currency,
      };

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // If we got an authorization URL, redirect to Paystack
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Payment authorization URL not received");
      }
    } catch (err) {
      console.error("Payment initialization error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize payment. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-20">
      <Section background="cream" padding="sm">
        <Container>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-black">
            Checkout
          </h1>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container>
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-brand-gray mb-8">Your cart is empty.</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-brand-black text-brand-white rounded-premium font-medium hover:bg-brand-charcoal transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Delivery Form */}
              <div className="lg:col-span-2">
                <div className="bg-brand-white rounded-premium p-6 border border-brand-light-gray">
                  <h2 className="font-heading text-xl text-brand-black mb-6">
                    Delivery Details
                  </h2>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-premium text-red-700">
                      {error}
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {formFields.map((field) => (
                      <div key={field.name}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-brand-gray mb-2"
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-premium text-brand-black placeholder:text-brand-taupe focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors ${
                              formErrors[field.name]
                                ? "border-red-500"
                                : "border-brand-light-gray focus:border-brand-gold"
                            }`}
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`w-full px-4 py-3 border rounded-premium text-brand-black placeholder:text-brand-taupe focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors ${
                              formErrors[field.name]
                                ? "border-red-500"
                                : "border-brand-light-gray focus:border-brand-gold"
                            }`}
                          />
                        )}

                        {formErrors[field.name] && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-brand-white rounded-premium p-6 border border-brand-light-gray sticky top-24">
                  <h2 className="font-heading text-xl text-brand-black mb-6">
                    Order Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item: CartItem) => (
                      <div
                        key={item.product._id}
                        className="flex gap-3 pb-4 border-b border-brand-light-gray last:border-0"
                      >
                        <div className="relative w-16 h-20 flex-shrink-0 bg-brand-ivory rounded-md overflow-hidden">
                          {item.product.mainImage ? (
                            <Image
                              src={item.product.mainImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-brand-nude"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm text-brand-black line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-brand-taupe">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-brand-black mt-1">
                            {BRAND.currencySymbol}
                            {(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3 border-t border-brand-light-gray">
                    <span className="text-brand-gray">Subtotal</span>
                    <span className="text-lg font-medium text-brand-black">
                      {BRAND.currencySymbol}{cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-3 border-t border-brand-light-gray">
                    <span className="font-medium text-brand-black">Total</span>
                    <span className="text-xl font-medium text-brand-black">
                      {BRAND.currencySymbol}{cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Pay Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={initializePayment}
                    disabled={isSubmitting}
                    className="w-full mt-6 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Pay {BRAND.currencySymbol}
                        {cart.subtotal.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {/* Help Text */}
                  <p className="mt-4 text-xs text-brand-taupe text-center">
                    You will be redirected to Paystack to complete your payment securely.
                  </p>

                  {/* Cancel Link */}
                  <Link
                    href="/cart"
                    className="block w-full mt-3 py-3 text-brand-gray text-center hover:text-brand-black transition-colors text-sm"
                  >
                    Return to Cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}