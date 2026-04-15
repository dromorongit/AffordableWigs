"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/constants";

interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AccountDashboard() {
  const { customer } = useAuth();
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/account/orders");
        const data = await response.json();

        if (data.success && data.orders) {
          const orders = data.orders;
          
          // Calculate summary
          const summary: OrderSummary = {
            totalOrders: orders.length,
            pendingOrders: orders.filter((o: { orderStatus: string }) => 
              ["Processing", "Paid"].includes(o.orderStatus)
            ).length,
            completedOrders: orders.filter((o: { orderStatus: string }) => 
              ["Delivered", "Shipped"].includes(o.orderStatus)
            ).length,
          };
          
          setOrderSummary(summary);
          
          // Get 3 most recent orders
          setRecentOrders(
            orders.slice(0, 3).map((order: { _id: string; orderNumber: string; total: number; orderStatus: string; createdAt: string }) => ({
              id: order._id,
              orderNumber: order.orderNumber,
              total: order.total,
              orderStatus: order.orderStatus,
              createdAt: order.createdAt,
            }))
          );
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

  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-background rounded-premium p-5 border border-neutral-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-text-primary">{orderSummary.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-premium p-5 border border-neutral-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Pending</p>
              <p className="text-2xl font-bold text-text-primary">{orderSummary.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-premium p-5 border border-neutral-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Completed</p>
              <p className="text-2xl font-bold text-text-primary">{orderSummary.completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background rounded-premium p-6 border border-neutral-light mb-8">
        <h2 className="font-heading text-xl text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/account/orders"
            className="flex items-center gap-4 p-4 rounded-premium border border-neutral-light hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">View All Orders</p>
              <p className="text-sm text-text-light">Track your order status</p>
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="flex items-center gap-4 p-4 rounded-premium border border-neutral-light hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Update Profile</p>
              <p className="text-sm text-text-light">Manage your personal info</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-premium p-6 border border-neutral-light">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-text-primary">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-primary hover:text-primary-700 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-premium border border-neutral-light hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-light rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-nude" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{order.orderNumber}</p>
                    <p className="text-sm text-text-light">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-primary">
                    {BRAND.currencySymbol}{order.total.toLocaleString()}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-neutral-nude mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-text-light mb-4">No orders yet</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-primary text-white rounded-premium font-medium hover:bg-primary-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}