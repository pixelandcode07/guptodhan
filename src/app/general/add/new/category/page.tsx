import React from 'react'
import CategoryForm from './Components/CategoryForm'
import Link from 'next/link'

export default function AddNewCategoryPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Create New Category</h1>
                    <p className="text-sm text-gray-500 mt-1">Add a new ecommerce category, upload icon and banner, and configure visibility.</p>
                </div>
                <Link href="/general/view/all/category" className="text-sm text-blue-600 hover:text-blue-700 underline">Back to categories</Link>
            </div>

            <div className="bg-white border rounded-md shadow-sm">
                <CategoryForm />
            </div>
        </div>
    )
}
