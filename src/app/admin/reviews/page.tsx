"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiEye, FiEyeOff } from "react-icons/fi";

interface Review {
  _id: string;
  customerName: string;
  message: string;
  rating: number;
  isVisible: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [formData, setFormData] = useState({
    customerName: "",
    message: "",
    rating: 5,
    isVisible: true,
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "visible") params.append("visible", "true");
      if (filter === "hidden") params.append("visible", "false");

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      rating: parseInt(formData.rating.toString()),
    };

    try {
      const url = editingReview
        ? `/api/admin/reviews/${editingReview._id}`
        : "/api/admin/reviews";

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingReview(null);
        resetForm();
        fetchReviews();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleToggleVisibility = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !review.isVisible }),
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert("Failed to update review visibility");
      }
    } catch (error) {
      console.error("Error toggling review visibility:", error);
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName,
      message: review.message,
      rating: review.rating,
      isVisible: review.isVisible,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      message: "",
      rating: 5,
      isVisible: true,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer reviews</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingReview(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Review
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-burgundy-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("visible")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "visible"
                ? "bg-burgundy-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Visible
          </button>
          <button
            onClick={() => setFilter("hidden")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "hidden"
                ? "bg-burgundy-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hidden
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reviews found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.customerName}
                      </h3>
                      {renderStars(review.rating)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          review.isVisible
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {review.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{review.message}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleVisibility(review)}
                      className="p-2 text-gray-400 hover:text-burgundy-600"
                      title={review.isVisible ? "Hide" : "Show"}
                    >
                      {review.isVisible ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(review)}
                      className="p-2 text-gray-400 hover:text-burgundy-600"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
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
                {editingReview ? "Edit Review" : "Add Review"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingReview(null);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>

              {/* Visible Toggle */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                />
                <span className="ml-2 text-sm text-gray-700">Visible on website</span>
              </label>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingReview(null);
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
                  {editingReview ? "Update" : "Create"} Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}