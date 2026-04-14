import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const cookieStore = cookies();
  const hasAuthCookie = cookieStore.has("admin_token");
  const admin = await getCurrentAdmin();
  
  // If no auth cookie, let the client handle redirect to login
  if (!hasAuthCookie || !admin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <AdminLayoutClient admin={admin}>
      {children}
    </AdminLayoutClient>
  );
}