"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiGrid, 
  FiShoppingBag, 
  FiTag, 
  FiShoppingCart, 
  FiStar, 
  FiSettings,
  FiPackage,
  FiLogOut
} from "react-icons/fi";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/products", label: "Products", icon: FiShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/admin/services", label: "Services", icon: FiPackage },
  { href: "/admin/reviews", label: "Reviews", icon: FiStar },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-burgundy-700 rounded-lg flex items-center justify-center">
            <FiShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold text-lg text-gray-900">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-burgundy-50 text-burgundy-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-burgundy-700" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}