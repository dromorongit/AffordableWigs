import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import Link from "next/link";
import { FiShoppingBag, FiShoppingCart, FiTag, FiAlertCircle, FiAlertTriangle, FiXCircle, FiScissors } from "react-icons/fi";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  recentOrders: any[];
  lowStockProducts: any[];
  outOfStockProducts: any[];
  totalStylingRevenue: number;
  totalStyledOrders: number;
  mostPopularStylingService: string;
  top5StylingServices: any[];
  percentageWithStyling: string;
  totalOrdersForPercentage: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await connectDB();

    const [totalProducts, totalCategories, totalOrdersCount] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Order.countDocuments({ paymentStatus: "paid" }),
    ]);

    const [stylingRevenueResult, totalStyledOrders, allServicesStats, topServices] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$stylingTotal" } } },
      ]),
      Order.countDocuments({ paymentStatus: "paid", stylingTotal: { $gt: 0 } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $group: { _id: "$items.stylingType", count: { $sum: 1 }, revenue: { $sum: { $multiply: ["$items.stylingPrice", "$items.quantity"] } } } },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $match: { "items.stylingType": { $ne: "none" } } },
        { $group: { _id: "$items.stylingName", count: { $sum: 1 }, revenue: { $sum: { $multiply: ["$items.stylingPrice", "$items.quantity"] } } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const stylingRevenue = stylingRevenueResult[0]?.total || 0;
    const mostPopular = allServicesStats.length > 0 ? allServicesStats[0]._id : "N/A";

    const services = await Order.find({ paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const lowStockProducts = await Product.find({
      stockQuantity: { $gt: 0, $lt: 5 },
      isActive: true,
    })
      .sort({ stockQuantity: 1 })
      .limit(5)
      .lean();

    const outOfStockProducts = await Product.find({
      stockQuantity: 0,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    return {
      totalProducts,
      totalCategories,
      totalOrders: totalOrdersCount,
      recentOrders: services,
      lowStockProducts,
      outOfStockProducts,
      totalStylingRevenue: stylingRevenue,
      totalStyledOrders,
      mostPopularStylingService: mostPopular,
      top5StylingServices: topServices.map((s: any) => ({
        name: s._id,
        count: s.count,
        revenue: s.revenue,
      })),
      percentageWithStyling: totalOrdersCount > 0 ? ((totalStyledOrders / totalOrdersCount) * 100).toFixed(1) : "0",
      totalOrdersForPercentage: totalOrdersCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      recentOrders: [],
      lowStockProducts: [],
      outOfStockProducts: [],
      totalStylingRevenue: 0,
      totalStyledOrders: 0,
      mostPopularStylingService: "N/A",
      top5StylingServices: [],
      percentageWithStyling: "0",
      totalOrdersForPercentage: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-burgundy-50 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-6 h-6 text-burgundy-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiTag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Total Orders (Paid Only) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Styling Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <FiScissors className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Styling Revenue</p>
              <p className="text-2xl font-bold text-gray-900">GH₵{stats.totalStylingRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Styled Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FiScissors className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Styled Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStyledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styling Analytics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Styling Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Most Popular Styling Service</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.mostPopularStylingService}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">% of Orders with Styling</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.percentageWithStyling}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Orders Analyzed</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalOrdersForPercentage}</p>
          </div>
        </div>

        {/* Top 5 Styling Services */}
        {stats.top5StylingServices.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top 5 Styling Services</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.top5StylingServices.map((service: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{service.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{service.count}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">GH₵{service.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-burgundy-700 hover:text-burgundy-800"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.customer?.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">GH₵{order.total?.toFixed(2)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <Link
                href="/admin/products"
                className="text-sm text-burgundy-700 hover:text-burgundy-800"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">All products are well stocked</p>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product: any) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                        {product.mainImage && (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.slug}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        {product.stockQuantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Out of Stock</h2>
              <Link
                href="/admin/products"
                className="text-sm text-burgundy-700 hover:text-burgundy-800"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.outOfStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">All products are in stock</p>
            ) : (
              <div className="space-y-4">
                {stats.outOfStockProducts.map((product: any) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-lg overflow-hidden">
                        {product.mainImage && (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.slug}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        Out of stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}