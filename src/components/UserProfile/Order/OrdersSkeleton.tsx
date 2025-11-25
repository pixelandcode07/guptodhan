import React from 'react';
import { SkeletonRect, SkeletonText } from '@/components/skeleton';

export default function OrdersSkeleton() {
  return (
    <div className="p-6">
      {/* Title skeleton */}
      <div className="px-4 mt-1 mb-4">
        <SkeletonRect width={120} height={24} />
      </div>
      
      {/* Filters skeleton */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRect key={index} width={80} height={36} className="rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Order cards skeleton */}
      <div className="px-4 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            {/* Header skeleton */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
              <div className="flex items-center gap-2">
                <SkeletonRect width={120} height={16} />
                <SkeletonRect width={100} height={14} className="rounded-full" />
              </div>
              <SkeletonRect width={80} height={20} className="rounded-full" />
            </div>
            
            {/* Content skeleton */}
            <div className="flex gap-4 p-4">
              {/* Image skeleton */}
              <SkeletonRect width={72} height={72} className="rounded" />
              
              {/* Text content skeleton */}
              <div className="flex-1 space-y-2">
                <SkeletonRect width="70%" height={16} />
                <SkeletonRect width="50%" height={12} />
                <SkeletonRect width="30%" height={16} />
                <SkeletonRect width="40%" height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

