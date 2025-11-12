import {
  SkeletonButton,
  SkeletonRect,
  SkeletonText,
} from '@/components/skeleton';

export default function OrderDetailsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SkeletonButton width={140} height={36} />
        <SkeletonRect width={160} height={16} />
      </div>

      <div className="space-y-6">
        {/* Order summary card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <SkeletonRect width={200} height={20} />
                <SkeletonRect width={180} height={16} />
              </div>
              <SkeletonRect width={120} height={20} />
            </div>
          </div>

          <div className="grid gap-6 px-4 py-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <SkeletonRect width="40%" height={16} />
                <SkeletonText lines={2} lineHeight={14} lastLineWidth="50%" />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="40%" height={16} />
                <SkeletonText lines={2} lineHeight={14} lastLineWidth="60%" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <SkeletonRect width="35%" height={16} />
                <SkeletonRect width={140} height={28} />
                <SkeletonRect width={120} height={14} />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="45%" height={16} />
                <SkeletonRect width={120} height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Order management */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-4">
            <SkeletonRect width={160} height={18} />
          </div>
          <div className="space-y-5 px-4 py-6">
            <div className="space-y-2">
              <SkeletonRect width="35%" height={16} />
              <SkeletonRect width="100%" height={44} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <SkeletonRect width="50%" height={16} />
                <SkeletonRect width="100%" height={44} />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="40%" height={16} />
                <SkeletonRect width="100%" height={44} />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonRect width="30%" height={16} />
              <SkeletonText lines={3} lineHeight={14} lastLineWidth="60%" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-gray-200 px-4 py-4">
            <SkeletonButton width={170} height={40} />
            <SkeletonButton width={210} height={40} />
            <SkeletonButton width={160} height={40} />
            <SkeletonButton width={140} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
}

