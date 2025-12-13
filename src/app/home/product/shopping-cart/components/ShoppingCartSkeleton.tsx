import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ShoppingCartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero navigation placeholder */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <SkeletonCircle size={32} />
              <SkeletonRect width={96} height={16} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-3 text-sm">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <SkeletonRect width={72} height={14} />
              {index < 3 && <SkeletonRect width={8} height={8} className="rounded-full" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items skeleton */}
          <Card className="lg:col-span-2 shadow-sm border border-gray-200">
            <CardHeader className="pb-0 space-y-4">
              <SkeletonRect width={180} height={20} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonCircle size={20} />
                  <SkeletonRect width={120} height={16} />
                </div>
                <SkeletonButton width={120} height={36} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Table header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 text-xs font-medium text-gray-500">
                <SkeletonRect height={16} className="col-span-4" />
                <SkeletonRect height={16} className="col-span-2" />
                <SkeletonRect height={16} className="col-span-2" />
                <SkeletonRect height={16} className="col-span-2" />
                <SkeletonRect height={16} className="col-span-2" />
              </div>

              {/* Table rows */}
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3 lg:col-span-4">
                      <SkeletonCircle size={20} className="mt-1" />
                      <div className="flex items-center gap-3">
                        <SkeletonRect width={72} height={72} className="rounded-lg" />
                        <div className="flex-1">
                          <SkeletonRect width="80%" height={16} />
                          <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" className="mt-2" />
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 flex items-center">
                      <SkeletonRect width={80} height={16} />
                    </div>
                    <div className="lg:col-span-2 flex items-center">
                      <SkeletonRect width={120} height={32} />
                    </div>
                    <div className="lg:col-span-2 flex items-center">
                      <SkeletonRect width={90} height={16} />
                    </div>
                    <div className="lg:col-span-2 flex items-center justify-end gap-2">
                      <SkeletonButton width={36} height={32} />
                      <SkeletonButton width={36} height={32} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                <SkeletonButton width={180} height={40} />
                <div className="flex gap-3">
                  <SkeletonButton width={120} height={40} />
                  <SkeletonButton width={140} height={40} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order summary skeleton */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="pb-0">
              <SkeletonRect width={160} height={20} />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <SkeletonRect width="45%" height={16} />
                  <SkeletonRect width="35%" height={16} />
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <SkeletonRect width="40%" height={18} />
                  <SkeletonRect width="30%" height={18} />
                </div>
                <SkeletonButton width="100%" height={48} />
              </div>
              <SkeletonText lines={3} lineHeight={12} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

