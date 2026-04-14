"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";

interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/services");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      sortOrder: parseInt(formData.sortOrder.toString()),
    };

    try {
      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingService(null);
        resetForm();
        fetchServices();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image || "",
      isActive: service.isActive,
      sortOrder: service.sortOrder || 0,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      isActive: true,
      sortOrder: 0,
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage services offered</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingService(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No services found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          service.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                    {service.image && (
                      <div className="mt-3 w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Sort Order: {service.sortOrder}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-gray-400 hover:text-burgundy-600"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? "Edit Service" : "Add Service"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingService(null);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Image */}
              <div>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Service Image"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
                    setEditingService(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800"
                >
                  {editingService ? "Update" : "Create"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}