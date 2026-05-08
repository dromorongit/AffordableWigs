import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-burgundy-100 rounded-full flex items-center justify-center">
          <svg className="h-8 w-8 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          We're Currently Under Maintenance
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We're performing some scheduled maintenance to improve your experience.
          The site will be back online shortly.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-4 h-4 bg-burgundy-200 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-burgundy-200 rounded-full animate-pulse delay-100"></div>
          <div className="w-4 h-4 bg-burgundy-200 rounded-full animate-pulse delay-200"></div>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          If you need immediate assistance, please contact us at
          <a href="mailto:support@affordablewigsgh.com" className="text-burgundy-600 hover:underline">
            support@affordablewigsgh.com
          </a>
        </p>
        <Link
          href="/admin/login"
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-burgundy-600 hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}