import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { connectDB } from "@/lib/mongodb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if this is the login page by checking cookies
  // If there's no admin_token cookie, skip redirect for login page
  const cookieStore = cookies();
  const hasAuthCookie = cookieStore.has("admin_token");
  
  // Also check via getCurrentAdmin which reads the cookie
  const admin = await getCurrentAdmin();
  
  // Skip authentication check if no cookie exists (user is on login page)
  // and we need to verify this is actually the login page
  if (!hasAuthCookie) {
    // Let the login page render without auth
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  // If has cookie but no valid admin, redirect to login
  if (!admin) {
    redirect("/admin/login");
  }

  // Ensure database connection
  await connectDB();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader adminName={admin.name} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}