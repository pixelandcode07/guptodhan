"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import {
  Review,
  createReviewColumns,
} from "@/components/TableHelper/review_columns";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import {
  SkeletonRect,
  SkeletonText,
  SkeletonButton,
} from "@/components/skeleton";

const ReviewsSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SkeletonRect width="40%" height={28} />
      <SkeletonButton width={160} height={40} />
    </div>
    <div className="rounded-lg border border-gray-200">
      <div className="grid gap-4 border-b border-gray-200 px-4 py-3 md:grid-cols-6">
        <SkeletonRect width="80%" height={16} />
        <SkeletonRect width="70%" height={16} />
        <SkeletonRect width="70%" height={16} />
        <SkeletonRect width="60%" height={16} />
        <SkeletonRect width="50%" height={16} />
        <SkeletonRect width="40%" height={16} />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="grid gap-4 px-4 py-5 md:grid-cols-6">
            <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" />
            <SkeletonText lines={2} lineHeight={12} lastLineWidth="50%" />
            <SkeletonRect width="60%" height={12} />
            <SkeletonText lines={2} lineHeight={12} lastLineWidth="50%" className="col-span-2" />
            <div className="flex items-center gap-2">
              <SkeletonButton width={80} height={32} />
              <SkeletonButton width={80} height={32} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ReviewsClient() {
  const [data, setData] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
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

      const productIds = Array.from(
        new Set(
          items
            .map((review) => review.productId)
            .filter((id): id is string => Boolean(id))
        )
      );

      let productNameMap: Record<string, string> = {};
      if (productIds.length) {
        const entries = await Promise.all(
          productIds.map(async (id) => {
            try {
              const res = await axios.get(`/api/v1/product/${id}`, {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  ...(userRole ? { "x-user-role": userRole } : {}),
                },
              });
              const payload =
                res.data?.data?.product ?? res.data?.data ?? res.data?.data?.data;
              const title =
                payload?.productTitle ||
                payload?.title ||
                payload?.name ||
                id;
              return [id, title] as const;
            } catch {
              return [id, id] as const;
            }
          })
        );
        productNameMap = Object.fromEntries(entries);
      }

      const mapped: Review[] = items.map((review, index) => ({
        id: index + 1,
        dbId: review._id,
        image: review.userImage || "",
        product: String(
          (review.productId && productNameMap[review.productId]) ??
            review.productId ??
            review.reviewId ??
            "N/A"
        ),
        rating: review.rating || 0,
        review: String(
          (review as ApiReview & { comment?: string }).comment ??
            review.reviewText ??
            ""
        ),
        reply_from_admin: review.replyFromAdmin || "",
        customer: String(review.userEmail ?? ""),
        name: String(review.userName ?? ""),
        status: review.status === "active" ? "Active" : "Inactive",
        created_at: review.createdAt
          ? new Date(review.createdAt).toLocaleString()
          : "",
      }));

      setData(mapped);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, userRole]);

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        await axios.delete(`/api/v1/product-review/${reviewId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });

        toast.success("Review deleted successfully!");
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
        toast.error("Failed to delete review. Please try again.");
      }
    },
    [token, userRole, fetchReviews]
  );

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 lg:px-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Ratings & Reviews
          </h1>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <ReviewsSkeleton />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <DataTable
                    columns={createReviewColumns(handleDeleteReview)}
                    data={data}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

