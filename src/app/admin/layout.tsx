import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { connectDB } from "@/lib/mongodb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current path to check if we're on the login page
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  
  // Skip authentication check for login page
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  // Check authentication
  const admin = await getCurrentAdmin();
  
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