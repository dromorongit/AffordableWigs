"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch maintenance mode setting on component mount
  useEffect(() => {
    const fetchMaintenanceMode = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        setMaintenanceMode(data.maintenanceMode);
      } catch (error) {
        console.error("Error fetching maintenance mode:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceMode();
  }, []);

  const handleToggleMaintenanceMode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maintenanceMode: !maintenanceMode }),
      });

      if (!response.ok) {
        throw new Error("Failed to update maintenance mode");
      }

      const data = await response.json();
      setMaintenanceMode(data.maintenanceMode);
    } catch (error) {
      console.error("Error updating maintenance mode:", error);
      // Revert the toggle on error
      setMaintenanceMode(!maintenanceMode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="Affordable Wigs Gh"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Store name is managed via constants</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              defaultValue="GHS (GH₵)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Currency is set to Ghana Cedis</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Gateway
            </label>
            <input
              type="text"
              defaultValue="Paystack"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Paystack is configured for payments</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Account</h2>
          <p className="text-sm text-gray-600">
            Your admin account is managed securely. Contact support if you need to reset your password.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            Currently, images are managed via URL input. To upload images, provide direct URLs to product/service images.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best results, use image URLs from Cloudinary, Imgur, or other image hosting services.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enable maintenance mode to temporarily disable the storefront for customers while you make updates.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Maintenance Mode
            </span>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {maintenanceMode ? "Enabled" : "Disabled"}
              </span>
              <label className="relative inline-flex h-6 w-11 items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none h-6 w-11"
                  checked={maintenanceMode}
                  onChange={handleToggleMaintenanceMode}
                  disabled={loading}
                />
                <span className="sr-only">Toggle maintenance mode</span>
                <span
                  className={`
                    pointer-events-none absolute inset-0 flex items-center
                    ${maintenanceMode ? "justify-end" : "justify-start"}
                    transition-transform duration-200 ease-in-out
                  `}
                >
                  <span
                    className={`
                      h-5 w-5 bg-white rounded-full shadow
                      ${maintenanceMode ? "translate-x-5" : "translate-x-0"}
                      peer-checked:bg-white
                    `}
                  ></span>
                </span>
                <span
                  className={`
                    pointer-events-none absolute inset-0 bg-gray-200 rounded-full
                    ${maintenanceMode ? "bg-burgundy-500" : ""}
                    transition-background duration-200 ease-in-out
                  `}
                ></span>
              </label>
              {loading && (
                <span className="text-xs text-gray-500 animate-spin">
                  ●
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}