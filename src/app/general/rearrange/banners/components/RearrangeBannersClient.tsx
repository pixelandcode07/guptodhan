'use client';

import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeBannersClient() {
  return (
    <ReorderList
      title="Rearrange Banners"
      description="Drag and drop to change the order. Click 'Save Order' to persist changes."
      fetchUrl="/api/v1/ecommerce-banners"
      patchUrl="/api/v1/ecommerce-banners"
      mapItem={(raw: unknown) => {
        const b = raw as {
          _id?: string;
          bannerTitle?: string;
          bannerPosition?: string;
          status?: string;
        };

        if (!b?._id) return null;

        const positionLabel = b.bannerPosition
          ? b.bannerPosition.replace(/-/g, ' ')
          : '';

        return {
          id: String(b._id),
          label: String(b.bannerTitle || 'Unnamed Banner'),
          extra: (
            <div className="flex items-center gap-2">
              {positionLabel && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {positionLabel}
                </span>
              )}
              {b.status && (
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    b.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } capitalize`}
                >
                  {b.status}
                </span>
              )}
            </div>
          ),
        };
      }}
      sortItems={(a, b) => a.label.localeCompare(b.label)}
    />
  );
}


