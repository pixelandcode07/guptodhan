"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { Review, review_columns } from "@/components/TableHelper/review_columns";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

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
      console.log("Fetching reviews with:", { token: !!token, userRole });
      
      const response = await axios.get("/api/v1/product-review", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      console.log("Reviews API Response:", response.data);

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

      console.log("Reviews found:", items.length, items);

      const mapped: Review[] = items.map((review, index) => ({
        id: index + 1,
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

      console.log("Mapped reviews:", mapped);
      setData(mapped);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      // Fallback to static data if API fails
      setData([
        {
          id: 1,
          image: "",
          product: "RFL Polypropylene Classic Art Chair",
          rating: 5,
          review: "Excellent product! Very comfortable and stylish.",
          reply_from_admin: "Thank you for your positive feedback!",
          customer: "customer@example.com",
          name: "John Doe",
          status: "Active",
          created_at: "2024-08-18 09:58:42 pm"
        },
        {
          id: 2,
          image: "",
          product: "DJI Osmo Mobile 6 Smartphone Gimbal",
          rating: 4,
          review: "Good quality, easy to use. Would recommend.",
          reply_from_admin: "",
          customer: "customer2@example.com",
          name: "Jane Smith",
          status: "Active",
          created_at: "2024-08-18 09:58:42 pm"
        },
        {
          id: 3,
          image: "",
          product: "Organic Leg Piece",
          rating: 3,
          review: "Average quality, could be better.",
          reply_from_admin: "We appreciate your feedback and will work on improving quality.",
          customer: "customer3@example.com",
          name: "Mike Johnson",
          status: "Active",
          created_at: "2024-08-18 09:58:42 pm"
        }
      ]);
    }
  }, [token, userRole]);

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
      <DataTable columns={review_columns} data={filteredData} />
    </div>
  );
}
