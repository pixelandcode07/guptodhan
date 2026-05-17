import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "./SearchResults";

// ✅ Next.js 15: searchParams is now a Promise — must be typed as Promise
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q = "" } = await searchParams; // ✅ await করা হলো
  return {
    title: q ? `"${q}" - Search Results | Guptodhan` : "Search Products | Guptodhan",
    description: q
      ? `Guptodhan-এ "${q}" সার্চের ফলাফল দেখুন। সেরা দামে পণ্য কিনুন।`
      : "Guptodhan-এ পণ্য সার্চ করুন।",
  };
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95vw] xl:container mx-auto px-4 py-6">
        <div className="h-7 w-72 bg-gray-200 rounded-lg animate-pulse mb-5" />
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-5 flex gap-3 animate-pulse">
          <div className="h-5 w-16 bg-gray-100 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-7 w-28 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse"
            >
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
                <div className="h-5 bg-gray-100 rounded w-2/5 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams; // ✅ await করা হলো — এটাই মূল fix

  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchResults query={q} />
    </Suspense>
  );
}