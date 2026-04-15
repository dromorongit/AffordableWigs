"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/constants";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    mainImage?: string;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/account/orders");
        const data = await response.json();

        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Paid":
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return ["Processing", "Paid", "Shipped"].includes(order.orderStatus);
    }
    if (filter === "completed") {
      return ["Delivered", "Cancelled"].includes(order.orderStatus);
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-text-primary">My Orders</h2>
        
        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-neutral-light rounded-premium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Orders</option>
          <option value="active">Active Orders</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-background rounded-premium border border-neutral-light overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-light/30 border-b border-neutral-light">
                <div>
                  <p className="font-medium text-text-primary">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-text-light">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-text-light">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="w-14 h-14 bg-neutral-light rounded-md flex items-center justify-center"
                    >
                      <svg className="w-6 h-6 text-neutral-nude" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                      </svg>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 bg-neutral-light rounded-md flex items-center justify-center text-xs text-text-light">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-neutral-light bg-neutral-light/10">
                <div className="mb-3 sm:mb-0">
                  <span className="text-text-light text-sm">Total:</span>
                  <span className="ml-2 text-lg font-bold text-text-primary">
                    {BRAND.currencySymbol}{order.total.toLocaleString()}
                  </span>
                </div>
                <Link
                  href={`/account/orders/${order._id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-premium font-medium hover:bg-primary-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-background rounded-premium border border-neutral-light">
          <svg className="w-20 h-20 mx-auto text-neutral-nude mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-text-primary mb-2">No orders found</h3>
          <p className="text-text-light mb-6">
            {filter !== "all" 
              ? "No orders match your filter criteria" 
              : "You haven't placed any orders yet"}
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-primary text-white rounded-premium font-medium hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}