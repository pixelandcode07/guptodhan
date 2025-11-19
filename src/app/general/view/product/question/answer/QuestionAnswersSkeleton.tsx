import {
  SkeletonRect,
  SkeletonText,
  SkeletonButton,
} from "@/components/skeleton";

export const QuestionAnswersSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonRect width="40%" height={28} />
        <SkeletonButton width={160} height={40} />
      </div>

      <div className="rounded-lg border border-gray-200">
        <div className="grid gap-4 border-b border-gray-200 px-4 py-3 md:grid-cols-6">
          <SkeletonRect width="80%" height={16} />
          <SkeletonRect width="70%" height={16} />
          <SkeletonRect width="70%" height={16} />
          <SkeletonRect width="60%" height={16} />
          <SkeletonRect width="60%" height={16} />
          <SkeletonRect width="40%" height={16} />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="grid gap-4 px-4 py-5 md:grid-cols-6"
            >
              <div className="space-y-2">
                <SkeletonRect width="80%" height={14} />
                <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" />
              </div>
              <div className="col-span-2 space-y-2">
                <SkeletonText lines={2} lineHeight={12} lastLineWidth="50%" />
              </div>
              <div className="space-y-2">
                <SkeletonText lines={2} lineHeight={12} lastLineWidth="50%" />
              </div>
              <div className="space-y-2">
                <SkeletonRect width="70%" height={12} />
                <SkeletonRect width="50%" height={12} />
              </div>
              <div className="flex items-center gap-2">
                <SkeletonButton width={80} height={32} />
                <SkeletonButton width={80} height={32} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

