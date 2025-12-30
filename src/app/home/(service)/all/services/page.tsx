import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import React from 'react'
import CategoryCard from '../../components/Re-useable/CategoryCard';

export default async function page() {
    let categories: IServiceCategory[] = [];

    try {
        categories = await fetchAllPublicServiceCategories();
    } catch (error) {
        console.error('Failed to load service categories:', error);
    }
    return (
        <div className='h-screen'>
            <div className=" max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((item) => (
                    <CategoryCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    )
}
