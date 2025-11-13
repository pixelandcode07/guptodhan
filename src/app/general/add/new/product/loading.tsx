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
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <SkeletonCircle size={40} className="bg-blue-200/70" />
              <SkeletonText lines={2} lineHeight={20} lastLineWidth="70%" />
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-end gap-2 sticky top-4 z-10 bg-gray-50/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm -mt-4 mb-6">
          <SkeletonButton width={96} height={40} />
          <SkeletonButton width={128} height={40} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                {/* Title */}
                <div className="space-y-2">
                  <SkeletonRect width="30%" height={16} />
                  <SkeletonRect height={44} />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <SkeletonRect width="40%" height={16} />
                  <SkeletonRect height={96} />
                </div>

                {/* Tabs Skeleton */}
                <div className="space-y-2">
                  <SkeletonRect height={42} />
                  <SkeletonRect height={180} className="rounded-lg" />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <SkeletonRect width="32%" height={16} />
                  <SkeletonRect height={44} />
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery Skeleton */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle>
                  <SkeletonRect width="45%" height={20} />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonRect key={i} height={128} className="rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Thumbnail Upload Card */}
            <Card>
              <CardHeader>
                <SkeletonRect width="60%" height={20} />
              </CardHeader>
              <CardContent>
                <SkeletonRect height={192} className="rounded-lg" />
              </CardContent>
            </Card>

            {/* Pricing & Details Card */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                {/* Pricing Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <SkeletonRect width="40%" height={16} />
                    <SkeletonRect height={40} />
                  </div>
                  <div className="space-y-2">
                    <SkeletonRect width="45%" height={16} />
                    <SkeletonRect height={40} />
                  </div>
                  <div className="space-y-2">
                    <SkeletonRect width="35%" height={16} />
                    <SkeletonRect height={40} />
                  </div>
                </div>

                {/* Product Code */}
                <div className="space-y-2">
                  <SkeletonRect width="50%" height={16} />
                  <SkeletonRect height={40} />
                </div>

                {/* Select Fields */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonRect width="40%" height={16} />
                    <SkeletonRect height={40} />
                  </div>
                ))}

                {/* Video URL */}
                <div className="space-y-2">
                  <SkeletonRect width="35%" height={16} />
                  <SkeletonRect height={40} />
                </div>

                {/* Special Offer */}
                <div className="flex items-center justify-between">
                  <SkeletonRect width="45%" height={16} />
                  <SkeletonRect width={44} height={24} className="rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Variant Section Skeleton */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <SkeletonRect width="35%" height={16} />
              <SkeletonRect width={44} height={24} className="rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* SEO Section Skeleton */}
        <Card className="mt-6">
          <CardHeader>
            <SkeletonRect width="55%" height={20} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <SkeletonRect width="35%" height={16} />
                <SkeletonRect height={40} />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="45%" height={16} />
                <SkeletonRect height={40} />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonRect width="35%" height={16} />
              <SkeletonRect height={80} />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <SkeletonButton width={96} height={40} />
          <SkeletonButton width={128} height={40} />
        </div>
      </div>
    </div>
  );
}

