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
  FiLogOut,
  FiX
} from "react-icons/fi";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/products", label: "Products", icon: FiShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/admin/services", label: "Services", icon: FiPackage },
  { href: "/admin/reviews", label: "Reviews", icon: FiStar },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href: string) => 
    pathname === href || 
    (href !== "/admin" && pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1"
            aria-label="Close menu"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        )}

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#800020] rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-[#800020] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive(item.href) ? "text-white" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}