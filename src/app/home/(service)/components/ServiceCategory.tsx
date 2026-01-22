// import PageHeader from '@/components/ReusableComponents/PageHeader';
// import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories';
// import { IServiceCategory } from '@/types/ServiceCategoryType';
// import { SquareDashedMousePointer } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// export default async function ServiceCategory() {
//     let categories: IServiceCategory[] = [];

//     try {
//         categories = await fetchAllPublicServiceCategories();
//     } catch (error) {
//         console.error('Failed to load service categories:', error);
//     }

//     return (
//         <div className="max-w-[90vw] mx-auto mt-8 px-4">
//             {categories.length === 0 ? (
//                 <p className="text-center py-12 text-gray-600">No service categories available</p>
//             ) :
//                 <>
//                     <PageHeader
//                         title='All Service Category'
//                         buttonLabel="Shop All Category"
//                         buttonHref='/all/services'
//                     />
//                     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {/* Render ALL categories */}
//                         {categories.map((item) => (
//                             <Link
//                                 key={item._id}
//                                 href={`/services/${item.slug}`}
//                                 className="group relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04]"
//                             >
//                                 {/* Fixed-size image container */}
//                                 <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-110">
//                                     <Image
//                                         src={item.icon_url}
//                                         alt={item.name}
//                                         width={48}
//                                         height={48}
//                                         className="object-contain transition-transform duration-300 group-hover:scale-110"
//                                     />
//                                 </div>

//                                 {/* Text area with wrapping */}
//                                 <div className="px-4 py-5 flex-1">
//                                     <h6 className="text-[#00005E] font-semibold text-base leading-tight line-clamp-3">
//                                         {item.name}
//                                     </h6>
//                                 </div>

//                                 {/* Subtle hover overlay */}
//                                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                             </Link>
//                         ))}

//                         {/* See All Services - Always at the end */}
//                         <Link
//                             href="/home/service"
//                             className="group relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04]"
//                         >
//                             <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 transition-all duration-300 group-hover:bg-purple-50 group-hover:scale-110">
//                                 <SquareDashedMousePointer
//                                     size={48}
//                                     className="text-gray-600 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110"
//                                 />
//                             </div>

//                             <div className="px-4 py-5 flex-1">
//                                 <h6 className="text-[#00005E] font-semibold text-base leading-tight">
//                                     See All Services
//                                 </h6>
//                             </div>

//                             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                         </Link>
//                     </div>
//                 </>
//             }
//         </div>
//     );
// }



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