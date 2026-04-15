"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";

interface Address {
  fullName: string;
  phone: string;
  deliveryAddress: string;
  cityOrTown: string;
  regionOrArea: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { customer, refreshCustomer } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/account/profile");
        const data = await response.json();

        if (data.success && data.user) {
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await refreshCustomer();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="bg-background rounded-premium p-6 border border-neutral-light">
        <h2 className="font-heading text-xl text-text-primary mb-6">Personal Information</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-premium ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={customer?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-neutral-light rounded-premium text-text-light bg-neutral-light/50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-text-light">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-neutral-light rounded-premium text-text-primary placeholder:text-neutral-taupe focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-neutral-light rounded-premium text-text-primary placeholder:text-neutral-taupe focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-background rounded-premium p-6 border border-neutral-light mt-6">
        <h2 className="font-heading text-xl text-text-primary mb-4">Account Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-neutral-light">
            <span className="text-text-light">Account Type</span>
            <span className="text-text-primary font-medium">Customer</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-light">
            <span className="text-text-light">Member Since</span>
            <span className="text-text-primary">
              {customer?.email ? "Active" : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}