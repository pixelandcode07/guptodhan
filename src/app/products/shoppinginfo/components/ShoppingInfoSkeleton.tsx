import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShoppingInfoSkeleton() {
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
        {/* Progress / breadcrumbs */}
        <div className="flex items-center gap-3 text-sm">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <SkeletonRect width={80} height={14} />
              {index < 3 && <SkeletonRect width={10} height={10} className="rounded-full" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info form card */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  <SkeletonRect width={180} height={22} />
                </CardTitle>
                <SkeletonText lines={2} lineHeight={14} />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <SkeletonRect width="60%" height={14} />
                      <SkeletonRect height={44} />
                    </div>
                    <div className="space-y-2">
                      <SkeletonRect width="55%" height={14} />
                      <SkeletonRect height={44} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery options */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <SkeletonRect width={160} height={20} />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <SkeletonCircle size={20} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <SkeletonRect width="45%" height={16} />
                      <SkeletonText lines={2} lineHeight={12} />
                    </div>
                    <SkeletonRect width={64} height={20} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Items list */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="flex flex-col gap-2">
                <SkeletonRect width={180} height={20} />
                <SkeletonRect width={120} height={14} />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 flex items-center gap-4"
                  >
                    <SkeletonRect width={72} height={72} className="rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <SkeletonRect width="70%" height={16} />
                      <SkeletonText lines={2} lineHeight={12} />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <SkeletonRect width={80} height={18} />
                      <SkeletonRect width={56} height={18} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column - order summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <SkeletonRect width={140} height={20} />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <SkeletonRect width="50%" height={16} />
                    <SkeletonRect width="30%" height={16} />
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <SkeletonRect width="45%" height={18} />
                    <SkeletonRect width="30%" height={18} />
                  </div>
                  <SkeletonButton width="100%" height={48} />
                </div>
                <SkeletonText lines={3} lineHeight={12} />
              </CardContent>
            </Card>

            {/* Coupon section placeholder */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <SkeletonRect width={160} height={18} />
              </CardHeader>
              <CardContent className="space-y-3">
                <SkeletonRect width="100%" height={40} />
                <SkeletonButton width="100%" height={38} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

