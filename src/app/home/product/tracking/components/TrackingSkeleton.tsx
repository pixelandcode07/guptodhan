import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TrackingSkeleton() {
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

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <SkeletonRect width={240} height={28} className="mx-auto" />
          <SkeletonRect width={320} height={18} className="mx-auto" />
        </div>

        {/* Tracking input skeleton */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="space-y-3">
            <SkeletonRect width={200} height={20} />
            <SkeletonText lines={2} lineHeight={14} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <SkeletonRect height={44} className="flex-1" />
              <SkeletonButton width={140} height={44} />
            </div>
            <SkeletonRect width="60%" height={16} className="mt-4" />
          </CardContent>
        </Card>

        {/* Tracking result skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="shadow-sm border border-gray-200">
              <CardHeader className="flex items-center gap-3">
                <SkeletonCircle size={28} />
                <SkeletonRect width={180} height={20} />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <SkeletonRect width="40%" height={16} />
                    <SkeletonRect width="30%" height={16} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline / status history skeleton */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="flex items-center gap-3">
            <SkeletonCircle size={28} />
            <SkeletonRect width={200} height={20} />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <SkeletonCircle size={16} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <SkeletonRect width="40%" height={16} />
                  <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" />
                </div>
                <SkeletonRect width={80} height={14} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

