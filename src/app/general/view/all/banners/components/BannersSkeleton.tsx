import { SkeletonRect, SkeletonButton, SkeletonCircle } from '@/components/skeleton';

export default function BannersSkeleton() {
  return (
    <div className="m-5">
      {/* Header Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <SkeletonRect height={28} width={128} />
        <div className="flex items-center gap-2">
          <SkeletonButton height={40} width={128} />
          <SkeletonButton height={40} width={112} />
        </div>
      </div>

      {/* Table Card Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 w-full overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 pb-3 border-b border-gray-200 mb-3">
            <SkeletonRect height={20} width={80} />
            <SkeletonRect height={20} width={64} />
            <SkeletonRect height={20} width={80} />
            <SkeletonRect height={20} width={80} />
            <SkeletonRect height={20} width={64} />
            <SkeletonRect height={20} width={80} />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100 last:border-b-0">
              {/* Banner Image */}
              <SkeletonRect width={80} height={48} className="rounded" />
              
              {/* Title */}
              <div className="flex items-center">
                <SkeletonRect height={16} width={128} />
              </div>
              
              {/* Sub Title */}
              <div className="flex items-center">
                <SkeletonRect height={16} width={96} />
              </div>
              
              {/* Position */}
              <div className="flex items-center">
                <SkeletonRect height={24} width={80} className="rounded-full" />
              </div>
              
              {/* Status */}
              <div className="flex items-center">
                <SkeletonRect height={24} width={64} className="rounded-full" />
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <SkeletonCircle size={32} />
                <SkeletonCircle size={32} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

