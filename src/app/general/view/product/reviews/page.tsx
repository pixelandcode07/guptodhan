"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { Review, createReviewColumns } from "@/components/TableHelper/review_columns";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function ViewAllReviewsPage() {
  const [data, setData] = useState<Review[]>([]);
  const [searchText, setSearchText] = useState("");
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

  const filteredData = data.filter((item) => {
    if (!searchText.trim()) return true;
    const search = searchText.toLowerCase();
    return (
      item.product.toLowerCase().includes(search) ||
      item.name.toLowerCase().includes(search) ||
      item.customer.toLowerCase().includes(search) ||
      item.review.toLowerCase().includes(search) ||
      item.reply_from_admin.toLowerCase().includes(search)
    );
  });

  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Ratings & Review</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input 
            type="text" 
            className="border border-gray-500" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search reviews..."
          />
        </span>
      </div>
      <DataTable columns={createReviewColumns(handleDeleteReview)} data={filteredData} />
    </div>
  );
}
