"use client";

import { FiUser, FiBell, FiSearch } from "react-icons/fi";

interface AdminHeaderProps {
  adminName: string;
}

export default function AdminHeader({ adminName }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-burgundy-500 focus:border-burgundy-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <FiBell className="w-5 h-5" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-burgundy-700" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{adminName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}