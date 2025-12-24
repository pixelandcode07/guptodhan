'use client';

import ReorderList from '@/components/Reorder/ReorderList';

export default function RearrangeBuySellCategoriesClient() {
    return (
        <ReorderList
            title="Rearrange Buy & Sell Categories"
            description="Drag and drop to reorder the categories in Buy & Sell section. Changes will reflect on homepage and navigation."
            fetchUrl="/api/v1/classifieds-categories"
            patchUrl="/api/v1/classifieds-categories"
            mapItem={(raw: any) => {
                if (!raw?._id) return null;

                return {
                    id: String(raw._id),
                    label: String(raw.name || 'Unnamed Category'),
                    extra: raw.status ? (
                        <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${raw.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {raw.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    ) : null,
                };
            }}
            sortItems={(a, b) => a.label.localeCompare(b.label)}
        />
    );
}