'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the product form with the ID parameter
    router.push(`/general/add/new/product?id=${params.id}`);
  }, [router, params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to edit product...</p>
      </div>
    </div>
  );
}
