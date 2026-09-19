"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

import {
  createStoreReviewFormSchema,
  CreateStoreReviewFormValues,
} from "../validations/store-review-validation";
import { toast } from "sonner";

type StoreReview = {
  _id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ReviewsTab({ storeId }: { storeId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(false);

  const toastStyle = {
    style: {
      background: '#ffffff',
      color: '#000000',
      border: '1px solid #e2e8f0'
    }
  };

  // ✅ MAGIC FIX: If user doesn't have an image, use a default fallback image
  const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const userImageToUse = session?.user?.image || defaultImage;

  const form = useForm<CreateStoreReviewFormValues>({
    resolver: zodResolver(createStoreReviewFormSchema),
    mode: "onChange",
    defaultValues: {
      storeId,
      userName: session?.user?.name ?? "Anonymous",
      userImage: userImageToUse, // ✅ Safe image passed
      rating: 5,
      comment: "",
    },
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/store-review-storeId/${storeId}`);
      setReviews(res.data.data ?? []);
    } catch (error) {
      console.error("❌ FETCH REVIEWS FAILED:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [storeId]);

  const onSubmit = async (data: CreateStoreReviewFormValues) => {
    try {
      // ✅ Ensure userImage is sent even if it's empty in state
      const finalData = {
        ...data,
        userImage: data.userImage || userImageToUse
      };


      await axios.post("/api/v1/store-review", finalData, {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
      });
      toast.success('Review Submitted!', {
        ...toastStyle,
        description: 'Thank you for your review.',
      });
      form.reset({ ...data, comment: "" });
      fetchReviews();
    } catch (error) {
      toast.error('Review Failed!', {
        ...toastStyle,
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Rating
                    value={field.value}
                    onChange={field.onChange}
                    items={5}
                    style={{ maxWidth: 140 }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write your review..."
                    rows={4}
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
            Submit Review
          </Button>
        </form>
      </Form>

      {/* ---------------- REVIEW LIST ---------------- */}
      <div className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}

        {reviews.map((review) => (
          <div key={review._id} className="rounded-xl border p-4 space-y-3 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3">
              <img
                src={review.userImage || defaultImage}
                alt={review.userName}
                className="h-10 w-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{review.userName}</p>
                <Rating
                  value={review.rating}
                  readOnly
                  items={5}
                  style={{ maxWidth: 100 }}
                />
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            {/* ✅ MAGIC FIX: break-words & whitespace-pre-wrap ensures long text doesn't overflow */}
            <div className="text-sm text-gray-700 w-full break-words whitespace-pre-wrap leading-relaxed">
              {review.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}