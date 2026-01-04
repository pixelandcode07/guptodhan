import { Skeleton } from "@/components/ui/skeleton"; // Adjust path if needed

// ServiceBannerSkeleton.tsx
export function ServiceBannerSkeleton() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-8 text-center">
        <Skeleton className="h-12 w-96 rounded-lg" /> {/* Title */}
        <Skeleton className="h-8 w-[600px] rounded-lg" /> {/* Subtitle */}
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-lg" /> {/* Primary button */}
          <Skeleton className="h-12 w-40 rounded-lg" /> {/* Secondary button */}
        </div>
      </div>
    </div>
  );
}

// ServiceCategorySkeleton.tsx (returns 8 skeletons)
export function ServiceCategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" /> {/* Icon placeholder */}
          <Skeleton className="h-4 w-20 rounded" /> {/* Category name */}
        </div>
      ))}
    </div>
  );
}

// ServiceCardsSkeleton.tsx (returns 4 card skeletons)
export function ServiceCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" /> {/* Image */}
          <div className="space-y-3 p-4">
            <Skeleton className="h-6 w-3/4 rounded" /> {/* Title */}
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" /> {/* Description */}
            <Skeleton className="h-10 w-32 rounded-lg mt-4" /> {/* Button */}
          </div>
        </div>
      ))}
    </div>
  );
}