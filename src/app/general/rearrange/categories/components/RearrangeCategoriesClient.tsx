'use client';
import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeCategoriesClient() {
  return (
    <ReorderList
      title="Rearrange Categories"
      description="Drag and drop to change the order. Click 'Save Order' to persist changes."
      fetchUrl="/api/v1/ecommerce-category/ecomCategory"
      patchUrl="/api/v1/ecommerce-category/ecomCategory"
      mapItem={(raw: any) => {
        if (!raw?._id) return null;
        return {
          id: String(raw._id),
          label: String(raw.name || 'Unnamed'),
          extra: raw.status ? (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${raw.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {raw.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          ) : null,
        };
      }}
      sortItems={(a, b) => a.label.localeCompare(b.label)}
    />
  );
}

