'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';

// types.ts
export type Review = {
  id: number;
  user: string;
  verified: boolean;
  rating: number;
  review: string;
  images?: string[];
  sellerResponse?: {
    message: string;
    date: string;
  };
};

type Props = {
  review: Review;
};

export function ReviewCard({ review }: Props) {
  return (
    <Card className="p-6 border shadow-none">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{review.user}</h3>
          {review.verified && (
            <p className="text-blue-600 text-sm flex items-center gap-1">
              Verified Purchase <CheckCircle className="w-4 h-4" />
            </p>
          )}
        </div>
        <div className="flex text-orange-400">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-orange-400" />
          ))}
        </div>
      </div>

      <p className="mt-3 text-gray-700">{review.review}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="review image"
              width={80}
              height={80}
              className="rounded-md border"
            />
          ))}
        </div>
      )}

      {review.sellerResponse && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border text-sm">
          <p className="text-blue-700 font-medium flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Seller Response - {review.sellerResponse.date}
          </p>
          <p className="mt-1 text-gray-600">{review.sellerResponse.message}</p>
        </div>
      )}
    </Card>
  );
}
