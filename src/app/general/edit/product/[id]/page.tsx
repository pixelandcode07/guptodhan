import ProductForm from '@/app/general/add/new/product/Components/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  if (!id || id === 'undefined' || id.trim() === '') {
    notFound();
  }

  // আমরা এখানে কোনো ডাটা ফেচ করছি না, সব ProductForm-এ হ্যান্ডেল করা হবে
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600">Update and manage your product listing</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* শুধু আইডি পাস করা হচ্ছে */}
        <ProductForm productId={id} />
      </div>
    </div>
  );
}