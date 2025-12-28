import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories'
import React from 'react'
import ClientDataTable from '../components/ClientDataTable'

export default async function AllServiceCategory() {
    const allCategory = await fetchAllPublicServiceCategories()
    console.log('allCategory', allCategory)
    return (
        <div>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">See All Service Categories</span>
                </h1>
            </div>

            <main>
                <ClientDataTable allCategory={allCategory} />
            </main>
        </div>
    )
}
