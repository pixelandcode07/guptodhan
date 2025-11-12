import {
  SkeletonButton,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function BrandsSkeleton() {
  return (
    <div className="m-5 p-5 border space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <SkeletonRect width={180} height={24} />
        </div>
        <div className="flex items-center justify-end gap-3">
          <SkeletonButton width={140} height={40} />
          <SkeletonButton width={160} height={40} />
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2 sm:col-span-1">
              <SkeletonRect width="60%" height={14} />
              <SkeletonRect height={38} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <SkeletonRect width="60%" height={14} />
              <SkeletonRect height={38} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <SkeletonRect width="60%" height={14} />
              <SkeletonRect height={38} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <SkeletonRect width="60%" height={14} />
              <SkeletonRect height={38} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <SkeletonRect width="60%" height={14} />
              <SkeletonRect height={38} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 text-sm text-gray-500">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonRect key={index} height={18} />
            ))}
          </div>

          {/* Table rows */}
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-6 gap-4 items-center rounded-lg border border-gray-100 px-3 py-3 bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <SkeletonRect width={44} height={44} className="rounded-md" />
                  <SkeletonText lines={2} lineHeight={12} lastLineWidth="70%" />
                </div>
                <SkeletonRect height={16} />
                <SkeletonRect height={16} />
                <SkeletonRect height={16} />
                <SkeletonRect height={16} />
                <div className="flex justify-end gap-2">
                  <SkeletonButton width={32} height={32} />
                  <SkeletonButton width={32} height={32} />
                  <SkeletonButton width={32} height={32} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

