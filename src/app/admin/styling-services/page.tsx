"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { useToast } from "@/components/ui";

interface StylingService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
  estimatedDuration: string;
}

export default function AdminStylingServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<StylingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<StylingService | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchServices = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(pagination.limit),
      });

      const response = await fetch(`/api/admin/styling-services?${params}`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.services || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        showToast("error", data.error || "Failed to fetch styling services");
      }
    } catch (error) {
      console.error("Error fetching styling services:", error);
      showToast("error", "Failed to fetch styling services");
    } finally {
      setLoading(false);
    }
  }, [search, pagination.limit, showToast]);

  useEffect(() => {
    fetchServices(1);
  }, [fetchServices]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const name = (document.getElementById("service-name") as HTMLInputElement)?.value?.trim() || "";
    const slug = (document.getElementById("service-slug") as HTMLInputElement)?.value?.trim() || "";
    const description = (document.getElementById("service-description") as HTMLTextAreaElement)?.value?.trim() || "";
    const price = (document.getElementById("service-price") as HTMLInputElement)?.value?.trim() || "";
    const estimatedDuration = (document.getElementById("service-estimatedDuration") as HTMLInputElement)?.value?.trim() || "";

    if (!name) errors.name = "Service name is required";
    if (!slug) errors.slug = "Slug is required";
    if (!description) errors.description = "Description is required";
    if (!price || isNaN(Number(price)) || Number(price) < 0) errors.price = "Valid price is required";
    if (!estimatedDuration) errors.estimatedDuration = "Estimated duration is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fix the form errors before submitting");
      return;
    }

    setSubmitting(true);

    const name = (document.getElementById("service-name") as HTMLInputElement).value.trim();
    const slug = (document.getElementById("service-slug") as HTMLInputElement).value.trim();
    const description = (document.getElementById("service-description") as HTMLTextAreaElement).value.trim();
    const price = Number((document.getElementById("service-price") as HTMLInputElement).value.trim());
    const sortOrder = parseInt((document.getElementById("service-sortOrder") as HTMLInputElement).value || "0", 10);
    const estimatedDuration = (document.getElementById("service-estimatedDuration") as HTMLInputElement).value.trim();
    const isActive = (document.getElementById("service-isActive") as HTMLInputElement).checked;

    const payload = {
      name,
      slug,
      description,
      price,
      sortOrder,
      estimatedDuration,
      isActive,
    };

    try {
      const url = editingService
        ? `/api/admin/styling-services/${editingService._id}`
        : "/api/admin/styling-services";

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", editingService ? "Styling service updated" : "Styling service created");
        setShowModal(false);
        setEditingService(null);
        setFormErrors({});
        fetchServices(pagination.page);
      } else {
        showToast("error", data.error || "Failed to save styling service");
      }
    } catch (error) {
      console.error("Error saving styling service:", error);
      showToast("error", "Failed to save styling service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this styling service? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/admin/styling-services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("success", "Styling service deleted successfully");
        const newTotal = pagination.total - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pagination.limit));
        const newPage = Math.min(pagination.page, newTotalPages);
        fetchServices(newPage);
      } else {
        const data = await response.json();
        showToast("error", data.error || "Failed to delete styling service");
      }
    } catch (error) {
      console.error("Error deleting styling service:", error);
      showToast("error", "Failed to delete styling service");
    }
  };

  const handleToggleActive = async (service: StylingService) => {
    try {
      const response = await fetch(`/api/admin/styling-services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", `Styling service ${!service.isActive ? "enabled" : "disabled"}`);
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isActive: !service.isActive } : s))
        );
      } else {
        showToast("error", data.error || "Failed to update styling service");
      }
    } catch (error) {
      console.error("Error toggling styling service:", error);
      showToast("error", "Failed to update styling service");
    }
  };

  const openEditModal = (service: StylingService) => {
    setEditingService(service);
    setFormErrors({});
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormErrors({});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Styling Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage styling services offered to customers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Styling Service
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search styling services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
          />
        </form>
      </div>

      {/* Styling Services List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No styling services found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Sort Order
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Est. Duration
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                   </th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Actions
                   </th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      GH₵{service.price.toLocaleString()}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {service.sortOrder}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {service.estimatedDuration}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(service)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-gray-400 hover:text-burgundy-600 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} services
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchServices(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchServices(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? "Edit Styling Service" : "Add Styling Service"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  id="service-name"
                  type="text"
                  required
                  defaultValue={editingService?.name || ""}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.name ? "border-red-500" : ""
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  id="service-slug"
                  type="text"
                  required
                  defaultValue={editingService?.slug || ""}
                  placeholder="e.g. frontal-styling"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.slug ? "border-red-500" : ""
                  }`}
                />
                {formErrors.slug && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="service-description"
                  rows={3}
                  required
                  defaultValue={editingService?.description || ""}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (GHS) *
                </label>
                <input
                  id="service-price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingService?.price || 0}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.price ? "border-red-500" : ""
                  }`}
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                )}
              </div>

               {/* Sort Order */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Sort Order
                 </label>
                 <input
                   id="service-sortOrder"
                   type="number"
                   min="0"
                   defaultValue={editingService?.sortOrder || 0}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                 />
               </div>

               {/* Estimated Duration */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Estimated Duration *
                 </label>
                 <input
                   id="service-estimatedDuration"
                   type="text"
                   required
                   defaultValue={editingService?.estimatedDuration || ""}
                   placeholder="e.g. Same Day, 1-2 Days, Within 24 Hours"
                   className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                     formErrors.estimatedDuration ? "border-red-500" : ""
                   }`}
                 />
                 {formErrors.estimatedDuration && (
                   <p className="mt-1 text-sm text-red-500">{formErrors.estimatedDuration}</p>
                 )}
               </div>

               {/* Active Toggle */}
               <label className="flex items-center">
                 <input
                   id="service-isActive"
                   type="checkbox"
                   defaultChecked={editingService?.isActive ?? true}
                   className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                 />
                 <span className="ml-2 text-sm text-gray-700">Active</span>
               </label>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingService ? "Update" : "Create"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
