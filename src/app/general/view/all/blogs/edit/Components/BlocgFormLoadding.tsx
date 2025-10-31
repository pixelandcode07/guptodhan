import React from 'react';

export default function BlogFormLoadding() {
  // ✅ Loading state UI (skeleton style)

  return (
    <div className="bg-white p-5 rounded-lg shadow space-y-6 animate-pulse">
      <div className="flex w-full justify-between items-center flex-wrap">
        <div className="h-6 w-40 bg-gray-200 rounded-md" /> {/* Title */}
        <div className="h-8 w-24 bg-gray-200 rounded-md" /> {/* Button */}
      </div>

      {/* Category, Title, Short Description */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* Cover Image */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-48 w-full bg-gray-200 rounded-lg" />
      </div>

      {/* Content Editor */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-60 w-full bg-gray-200 rounded-lg" />
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* SEO Form */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* Update Button */}
      <div className="flex justify-end pt-4">
        <div className="h-10 w-[200px] bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}
