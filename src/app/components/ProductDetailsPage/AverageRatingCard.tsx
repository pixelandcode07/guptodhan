'use client';

import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const ratingData = {
  average: 4.5,
  total: 5391,
  distribution: [
    { stars: 5, count: 4280 },
    { stars: 4, count: 3200 },
    { stars: 3, count: 2100 },
    { stars: 2, count: 1200 },
    { stars: 1, count: 600 },
  ],
};

export function AverageRatingCard() {
  const max = Math.max(...ratingData.distribution.map(d => d.count));

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
      <p className="mb-6">
        Average rating: <span className="font-bold">{ratingData.average}</span>{' '}
        ({ratingData.total})
      </p>
      <div className="space-y-3">
        {ratingData.distribution.map(d => (
          <div key={d.stars} className="flex items-center gap-2">
            <span className="flex items-center w-4">
              <Star className="w-4 h-4 text-gray-500" />
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${(d.count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-14 text-right">
              {(d.count / 1000).toFixed(2)}K
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
