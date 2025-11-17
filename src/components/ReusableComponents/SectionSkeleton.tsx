export default function SectionSkeleton({ title, count }: { title: string; count: number }) {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-gray-300 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-300 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}