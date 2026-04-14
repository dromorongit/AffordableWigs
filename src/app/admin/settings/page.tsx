"use client";

export default function AdminSettingsPage() {
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
      </div>
    </div>
  );
}