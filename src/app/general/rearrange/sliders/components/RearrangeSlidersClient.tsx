'use client';
import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeSlidersClient() {
  return (
    <ReorderList
      title="Rearrange Sliders"
      description="Drag and drop to change the order. Click 'Save Order' to persist changes."
      fetchUrl="/api/v1/slider-form"
      patchUrl="/api/v1/slider-form"
      mapItem={(raw: unknown) => {
        const s = raw as { _id?: string; bannerTitleWithColor?: string; status?: string };
        if (!s?._id) return null;
        return {
          id: String(s._id),
          label: String(s.bannerTitleWithColor || 'Unnamed Slider'),
          extra: s?.status ? (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {s.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          ) : null,
        };
      }}
      sortItems={(a, b) => a.label.localeCompare(b.label)}
    />
  );
}

