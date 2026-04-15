"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiEye, FiX } from "react-icons/fi";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage?: string;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  cityOrTown: string;
  regionOrArea: string;
  orderNotes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  paymentReference?: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const ORDER_STATUSES = ["Paid", "Processing", "Ready for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("orderStatus", statusFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Ready for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage customer orders (Paid orders only)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{order.customer?.fullName}</p>
                        <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                        <p className="text-xs text-gray-500">{order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      GH₵{order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-burgundy-600"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} results
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-lg ${
                  currentPage === page
                    ? "bg-burgundy-700 text-white border-burgundy-700"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedOrder.orderStatus === status
                          ? "bg-burgundy-700 text-white border-burgundy-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-burgundy-500"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedOrder.customer?.fullName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {selectedOrder.customer?.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {selectedOrder.customer?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.customer?.deliveryAddress}, {selectedOrder.customer?.cityOrTown},{" "}
                    {selectedOrder.customer?.regionOrArea}
                  </p>
                  {selectedOrder.customer?.orderNotes && (
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {selectedOrder.customer?.orderNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {item.mainImage && (
                                <img
                                  src={item.mainImage}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded mr-3"
                                />
                              )}
                              <span className="text-sm text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">GH₵{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            GH₵{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-700 text-right">
                          Subtotal
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          GH₵{selectedOrder.subtotal?.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          Total
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          GH₵{selectedOrder.total?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      selectedOrder.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                  {selectedOrder.paymentReference && (
                    <p className="text-sm">
                      <span className="font-medium">Reference:</span> {selectedOrder.paymentReference}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Currency:</span> {selectedOrder.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}