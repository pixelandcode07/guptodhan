'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';

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

// --- Review Data ---
const reviews: Review[] = [
  {
    id: 1,
    user: 'Vertric Honer',
    verified: true,
    rating: 5,
    review:
      'I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn’t be happier. Phone arrived quickly and works flawlessly.',
    images: ['/img1.png', '/img2.png'],
    sellerResponse: {
      message:
        'Thank you very much on behalf of Larkspur Shop. Keep following Larkspur Shop to get better products.',
      date: '1 year ago',
    },
  },
  {
    id: 2,
    user: 'Sophia Turner',
    verified: true,
    rating: 4,
    review:
      'The phone is in great condition, only minor scratches. Battery health is decent too. Overall very satisfied!',
    images: ['/img3.png'],
  },
  {
    id: 3,
    user: 'Michael Carter',
    verified: false,
    rating: 5,
    review:
      'Amazing product. Packaging was excellent, and performance is like brand new!',
  },
  {
    id: 4,
    user: 'Emily Davis',
    verified: true,
    rating: 3,
    review:
      'Phone works fine but delivery was late by 5 days. That’s why I rated 3 stars.',
  },
  {
    id: 5,
    user: 'James Lee',
    verified: true,
    rating: 5,
    review:
      'Best deal I’ve ever gotten! Seller communication was great, and the product exceeded expectations.',
    images: ['/img4.png', '/img5.png'],
    sellerResponse: {
      message: 'We appreciate your kind words! Thank you for trusting us.',
      date: '6 months ago',
    },
  },
  {
    id: 6,
    user: 'Olivia Brown',
    verified: true,
    rating: 4,
    review:
      'Really good product for the price. Performance is excellent. Would definitely recommend!',
  },
];

// --- Review List Component ---
export default function ReviewList() {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, reviews.length));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">All Reviews({reviews.length})</h2>

      {reviews.slice(0, visibleCount).map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {visibleCount < reviews.length && (
        <div className="flex justify-center">
          <Button variant="outline" className="mt-4" onClick={handleSeeMore}>
            See More ({reviews.length} Reviews)
          </Button>
        </div>
      )}
    </div>
  );
}
