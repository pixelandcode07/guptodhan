// app/home/visit-store/[id]/page.tsx
import StoreHeader from './StoreHeader';
import ProductGridWithFilters from './ProductGridWithFilters';

export default async function VisitStore({ params }: { params: { id: string } }) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/vendor-store/store-with-product/${id}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        return <div className="container py-10">Store not found</div>;
    }

    const { data } = await res.json();
    const { store, productsWithReviews } = data;

    return (
        <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-10">
            {/* Server-rendered header */}
            <StoreHeader store={store} />

            {/* Client-side interactive grid + filters */}
            <ProductGridWithFilters initialProducts={productsWithReviews} storeId={id} />
        </div>
    );
}