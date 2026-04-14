"use client";

import { FiUser, FiBell, FiSearch, FiMenu } from "react-icons/fi";
import { useState } from "react";

interface AdminHeaderProps {
  adminName: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({ adminName, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
        aria-label="Toggle menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Search - hidden on mobile, visible on larger screens */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#800020] focus:border-[#800020] sm:text-sm"
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
          <div className="w-8 h-8 bg-[#800020] rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-white" />
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