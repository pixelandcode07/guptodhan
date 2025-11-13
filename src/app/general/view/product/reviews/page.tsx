"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { Review, createReviewColumns } from "@/components/TableHelper/review_columns";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function ViewAllReviewsPage() {
  const [data, setData] = useState<Review[]>([]);
  const { data: session } = useSession();

  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/product-review", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      type ApiReview = {
        _id?: string;
        reviewId?: string;
        productId?: string;
        userId?: string;
        userName?: string;
        userEmail?: string;
        userImage?: string;
        rating?: number;
        reviewText?: string;
        replyFromAdmin?: string;
        status?: string;
        createdAt?: string;
      };

      const items: ApiReview[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const mapped: Review[] = items.map((review, index) => ({
        id: index + 1,
        dbId: review._id,
        image: review.userImage || "",
        product: String(review.productId ?? ""),
        rating: review.rating || 0,
        review: String(review.reviewText ?? ""),
        reply_from_admin: review.replyFromAdmin || "",
        customer: String(review.userEmail ?? ""),
        name: String(review.userName ?? ""),
        status: review.status === 'active' ? 'Active' : 'Inactive',
        created_at: review.createdAt
          ? new Date(review.createdAt).toLocaleString()
          : "",
      }));

      setData(mapped);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setData([]);
    }
  }, [token, userRole]);

  const handleDeleteReview = useCallback(async (reviewId: string) => {
    try {
      await axios.delete(`/api/v1/product-review/${reviewId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Review deleted successfully!");
      // Refresh the data after successful deletion
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  }, [token, userRole, fetchReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Ratings & Reviews</h1>
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <DataTable 
                  columns={createReviewColumns(handleDeleteReview)} 
                  data={data} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
