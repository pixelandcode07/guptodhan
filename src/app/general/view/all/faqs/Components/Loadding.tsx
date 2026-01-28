import { Skeleton } from "@/components/ui/skeleton"

export default function Loadding() {
  return (
    <div className="w-full space-y-4 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border p-4 space-y-4">
        {/* Table Header */}
        <div className="flex items-center justify-between space-x-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/6" />
        </div>
        
        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between space-x-4 pt-4 border-t">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/6" />
          </div>
        ))}
      </div>
    </div>
  )
}