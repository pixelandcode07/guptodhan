'use client';
import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeFlagsPage() {
  return (
    <ReorderList
      title="Rearrange Flags"
      description="Drag and drop to change the order. Click 'Save Order' to persist changes."
      fetchUrl="/api/v1/product-config/productFlag"
      patchUrl="/api/v1/product-config/productFlag"
      mapItem={(raw: unknown) => {
        const f = raw as { _id?: string; name?: string; status?: string };
        if (!f?._id) return null;
        return {
          id: String(f._id),
          label: String(f.name || 'Unnamed Flag'),
          extra: f?.status ? (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${f.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {f.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          ) : null,
        };
      }}
      sortItems={(a, b) => a.label.localeCompare(b.label)}
    />
  );
}


