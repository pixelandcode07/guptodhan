
import ProductForm from './Components/ProductForm';

export default function page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h1>
                                <p className="text-sm text-gray-600">Create and manage your product listings</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ProductForm />
            </div>
        </div>
    );
}