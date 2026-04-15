"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string } | string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  mainImage: string;
  shortDescription?: string;
  description?: string;
  images?: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    compareAtPrice: "",
    stockQuantity: "",
    shortDescription: "",
    description: "",
    mainImage: "",
    images: [] as string[],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!formData.category) {
      errors.category = "Please select a category";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Please enter a valid price";
    }
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      errors.stockQuantity = "Please enter a valid stock quantity";
    }
    if (!formData.mainImage) {
      errors.mainImage = "Main image is required";
    }
    
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
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      stockQuantity: parseInt(formData.stockQuantity),
      images: formData.images || [],
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : "/api/admin/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        setFormErrors({});
        fetchProducts();
        showToast("success", editingProduct ? "Product updated successfully" : "Product created successfully");
      } else {
        const data = await response.json();
        setFormErrors({ submit: data.error || "Failed to save product" });
        showToast("error", data.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
        showToast("success", "Product deleted successfully");
      } else {
        showToast("error", "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("error", "An unexpected error occurred");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: typeof product.category === "object" ? product.category._id : "",
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      stockQuantity: product.stockQuantity.toString(),
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      mainImage: product.mainImage || "",
      images: product.images || [],
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      compareAtPrice: "",
      stockQuantity: "",
      shortDescription: "",
      description: "",
      mainImage: "",
      images: [],
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      isActive: true,
    });
    setFormErrors({});
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.mainImage && (
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {typeof product.category === "object" && product.category !== null 
                        ? (product.category as any).name 
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      GH₵{product.price.toFixed(2)}
                      {product.compareAtPrice && (
                        <span className="ml-2 text-gray-400 line-through text-xs">
                          GH₵{product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stockQuantity > 10
                          ? "bg-green-100 text-green-800"
                          : product.stockQuantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Featured</span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Best Seller</span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">New</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-burgundy-600"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600"
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} results
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-lg ${
                  currentPage === page
                    ? "bg-burgundy-700 text-white border-burgundy-700"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) {
                      const { name: _, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (formErrors.category) {
                      const { category: _, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.category ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (formErrors.price) {
                      const { price: _, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                      formErrors.price ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stockQuantity}
                  onChange={(e) => {
                    setFormData({ ...formData, stockQuantity: e.target.value });
                    if (formErrors.stockQuantity) {
                      const { stockQuantity: _, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500 ${
                    formErrors.stockQuantity ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {formErrors.stockQuantity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.stockQuantity}
                  </p>
                )}
              </div>

              {/* Images */}
              <div>
                <ImageUploader
                  value={formData.mainImage}
                  onChange={(url) => {
                    setFormData({ ...formData, mainImage: url });
                    if (formErrors.mainImage) {
                      const { mainImage: _, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                  }}
                  label="Main Image *"
                />
                {formErrors.mainImage && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.mainImage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images
                </label>
                <ImageUploader
                  value={formData.images[0] || ""}
                  onChange={(url) => {
                    const currentImages = formData.images || [];
                    if (url && !currentImages.includes(url)) {
                      setFormData({ ...formData, images: [...currentImages, url] });
                    }
                  }}
                  label=""
                />
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Additional ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== idx);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                    setFormErrors({});
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingProduct ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingProduct ? "Update" : "Create"  
                  )} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}