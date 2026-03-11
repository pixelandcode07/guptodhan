import ProductForm from '@/app/general/add/new/product/Components/ProductForm';
import React, { Suspense } from 'react'; // Import Suspense


export default function ProductFormPage() {
    return (
        <div>
            {/* The fallback is what's shown while the component loads */}
            <Suspense fallback={<div>Loading form...</div>}>
                <ProductForm />
            </Suspense>
        </div>
    );
}