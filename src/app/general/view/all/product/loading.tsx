import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonCircle size={32} className="bg-blue-200/70" />
              <SkeletonRect width={160} height={24} />
            </div>
            <SkeletonButton width={120} height={36} />
          </div>
        </div>

        {/* Filters Card */}
        <Card className="mb-4 sm:mb-6 shadow-lg border border-gray-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              <SkeletonRect width={120} height={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <SkeletonRect width="55%" height={14} />
                <SkeletonRect height={40} />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="45%" height={14} />
                <SkeletonRect height={40} />
              </div>
              <div className="flex items-end">
                <SkeletonButton width="100%" height={40} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-xl">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <SkeletonRect width="35%" height={18} />
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Table header */}
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500">
                  <SkeletonRect height={16} />
                  <SkeletonRect height={16} />
                  <SkeletonRect height={16} />
                  <SkeletonRect height={16} />
                  <SkeletonRect height={16} />
                  <SkeletonRect height={16} />
                </div>

                {/* Table rows */}
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-4 items-center bg-white rounded-lg border border-gray-100 px-3 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <SkeletonRect width={48} height={48} className="rounded-md" />
                        <SkeletonText lines={2} lineHeight={12} lastLineWidth="70%" />
                      </div>
                      <SkeletonRect height={16} />
                      <SkeletonRect height={16} />
                      <SkeletonRect height={16} />
                      <SkeletonRect height={16} />
                      <div className="flex justify-end gap-2">
                        <SkeletonButton width={32} height={28} />
                        <SkeletonButton width={32} height={28} />
                        <SkeletonButton width={32} height={28} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

