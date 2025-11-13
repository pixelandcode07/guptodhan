'use client';
import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeBrandsClient() {
  return (
    <ReorderList
      title="Rearrange Brands"
      description="Drag and drop to change the brand order. Click 'Save Order' to persist changes."
      fetchUrl="/api/v1/product-config/brandName"
      patchUrl="/api/v1/product-config/brandName"
      mapItem={(raw: unknown) => {
        const b = raw as { _id?: string; name?: string; status?: string };
        if (!b?._id) return null;
        return {
          id: String(b._id),
          label: String(b.name || 'Unnamed Brand'),
          extra: b?.status ? (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {b.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          ) : null,
        };
      }}
      sortItems={(a, b) => a.label.localeCompare(b.label)}
    />
  );
}

