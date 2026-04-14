import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import Link from "next/link";
import { FiShoppingBag, FiShoppingCart, FiTag, FiAlertCircle } from "react-icons/fi";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await connectDB();
    
    const [products, categories, orders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Order.countDocuments({ paymentStatus: "paid" }),
    ]);

    // Get recent paid orders
    const recentOrders = await Order.find({ paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get low stock products (less than 5)
    const lowStockProducts = await Product.find({ 
      stockQuantity: { $lt: 5 },
      isActive: true 
    })
      .sort({ stockQuantity: 1 })
      .limit(5)
      .lean();

    return {
      totalProducts: products,
      totalCategories: categories,
      totalOrders: orders,
      recentOrders,
      lowStockProducts,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      recentOrders: [],
      lowStockProducts: [],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {product.stockQuantity} left
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