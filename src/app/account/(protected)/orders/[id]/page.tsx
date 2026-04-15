"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/constants";
import { Container, Section } from "@/components/ui";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  subtotal: number;
  total: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    mainImage?: string;
  }>;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    cityOrTown: string;
    regionOrArea: string;
    orderNotes?: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/account/orders/${params.id}`);
        const data = await response.json();

        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || "Order not found");
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Paid":
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackingSteps = (orderStatus: string) => {
    const steps = [
      { status: "Processing", label: "Order Placed", completed: true },
      { status: "Paid", label: "Payment Confirmed", completed: ["Paid", "Shipped", "Delivered"].includes(orderStatus) },
      { status: "Shipped", label: "Shipped", completed: ["Shipped", "Delivered"].includes(orderStatus) },
      { status: "Delivered", label: "Delivered", completed: orderStatus === "Delivered" },
    ];

    if (orderStatus === "Cancelled") {
      return [
        { status: "Processing", label: "Order Placed", completed: true },
        { status: "Cancelled", label: "Order Cancelled", completed: true, isCancelled: true },
      ];
    }

    return steps;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-text-light mb-6">{error || "Order not found"}</p>
        <Link
          href="/account/orders"
          className="inline-block px-6 py-3 bg-primary text-white rounded-premium font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.orderStatus);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-light mb-4">
        <Link href="/account" className="hover:text-text-primary">Account</Link>
        <span>/</span>
        <Link href="/account/orders" className="hover:text-text-primary">Orders</Link>
        <span>/</span>
        <span className="text-text-primary">{order.orderNumber}</span>
      </div>

      <h1 className="font-heading text-2xl md:text-3xl text-text-primary mb-6">
        Order {order.orderNumber}
      </h1>

      {/* Status Banner */}
      <div className={`rounded-premium p-4 mb-8 border ${getStatusColor(order.orderStatus)}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-medium">
              Status: <span className="font-bold">{order.orderStatus}</span>
            </p>
            <p className="text-sm opacity-80">
              Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
            </p>
          </div>
          <p className="text-sm">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-background rounded-premium p-6 border border-neutral-light mb-8">
        <h2 className="font-heading text-xl text-text-primary mb-6">Order Tracking</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-light" />
          <div className="space-y-6">
            {trackingSteps.map((step) => (
              <div key={step.status} className="relative flex items-start gap-4 pl-8">
                <div className={`absolute left-2.5 w-3 h-3 rounded-full mt-1.5 ${
                  step.isCancelled 
                    ? "bg-red-500" 
                    : step.completed 
                      ? "bg-green-500" 
                      : "bg-neutral-light"
                }`} />
                <div>
                  <p className={`font-medium ${step.isCancelled ? "text-red-600" : step.completed ? "text-text-primary" : "text-text-light"}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-background rounded-premium p-6 border border-neutral-light">
            <h2 className="font-heading text-xl text-text-primary mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-neutral-light last:border-0"
                >
                  <div className="relative w-20 h-24 bg-neutral-light rounded-md overflow-hidden flex-shrink-0">
                    {item.mainImage && !imageErrors.has(item.productId) ? (
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(item.productId)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-nude" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary line-clamp-1">{item.name}</p>
                    <p className="text-sm text-text-light">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-text-primary mt-1">
                      {BRAND.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-neutral-light">
              <div className="flex justify-between py-2">
                <span className="text-text-light">Subtotal</span>
                <span className="text-text-primary">{BRAND.currencySymbol}{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-text-primary">Total</span>
                <span className="text-lg font-bold text-text-primary">{BRAND.currencySymbol}{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="lg:col-span-1">
          <div className="bg-background rounded-premium p-6 border border-neutral-light">
            <h2 className="font-heading text-xl text-text-primary mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-light mb-1">Full Name</p>
                <p className="text-text-primary font-medium">{order.customer.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Phone</p>
                <p className="text-text-primary">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Email</p>
                <p className="text-text-primary">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Delivery Address</p>
                <p className="text-text-primary">
                  {order.customer.deliveryAddress}<br />
                  {order.customer.cityOrTown}, {order.customer.regionOrArea}
                </p>
              </div>
              {order.customer.orderNotes && (
                <div>
                  <p className="text-sm text-text-light mb-1">Order Notes</p>
                  <p className="text-text-primary">{order.customer.orderNotes}</p>
                </div>
              )}
              {order.paymentReference && (
                <div className="pt-4 border-t border-neutral-light">
                  <p className="text-sm text-text-light mb-1">Payment Reference</p>
                  <p className="text-text-primary font-mono text-sm">{order.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}