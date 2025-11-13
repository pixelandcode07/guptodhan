// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Skeleton */}
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg max-w-[95vw] xl:max-w-[90vw] mx-auto mt-10"></div>
      </div>

      {/* Featured Categories Skeleton */}
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 mt-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale Skeleton */}
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 mt-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Selling Skeleton */}
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 mt-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}