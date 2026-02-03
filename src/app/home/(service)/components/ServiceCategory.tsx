// 'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import MobileCategoryCarousel from './Re-useable/MobileCategoryCarousel';
import CategoryCard from './Re-useable/CategoryCard';
import SeeAllCard from './Re-useable/SeeAllCard';
import Link from 'next/link';

export default async function ServiceCategory() {
    let categories: IServiceCategory[] = [];

    try {
        categories = await fetchAllPublicServiceCategories();
    } catch (error) {
        console.error('Failed to load service categories:', error);
    }

    const displayedCategories = categories.slice(0, 12);

    return (
        <div className="md:max-w-[95vw] xl:container mx-auto py-4">
            {displayedCategories.length === 0 ? (
                <p className="text-center py-12 text-gray-600">No service categories available</p>
            ) : (
                <>
                    {/* Mobile Header */}
                    <div className="md:hidden">
                        <PageHeader
                            title="All Category"
                            buttonLabel="See All"
                            buttonHref="/home/all/services"
                        />
                    </div>

                    {/* Desktop/Tablet Header */}
                    <div className="hidden md:block">
                        <PageHeader
                            title="All Service Category"
                            buttonLabel="View All Category"
                            buttonHref="/home/all/services"
                        />
                    </div>

                    {/* Mobile: Carousel View */}
                    <div className="md:hidden">
                        <MobileCategoryCarousel categories={displayedCategories} />
                    </div>

                    {/* Desktop: Grid View */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedCategories.map((item) => (
                            <CategoryCard key={item._id} item={item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}