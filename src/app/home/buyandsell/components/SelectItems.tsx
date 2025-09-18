'use client'

import { categories, Category, Subcategory } from '@/data/buy_sell_data';
import { ChevronRight, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SelectItems() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    const router = useRouter();

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null); // reset subcategory when switching category
    };

    const handleSubcategoryClick = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);

        // After selecting category + subcategory, go to location page
        router.push(
            `/home/buyandsell/location?category=${selectedCategory?.name}&subcategory=${subcategory.name}`
        );
    };




    return (
        <>
            <h1 className='font-medium text-2xl py-10 text-center'>Choose any option below</h1>

            <div className="flex max-w-[60vw] mx-auto mb-30">
                {/* Left side - Categories */}
                <div className="w-2/4 bg-gray-100 p-4 border-r">
                    <h2 className="text-lg font-bold mb-3">Select Your Category</h2>
                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className={`w-full flex justify-between cursor-pointer p-2 rounded-md ${selectedCategory?.id === cat.id ?
                                    "text-[#0097E9] bg-[#ffff]" : "hover:bg-gray-200"
                                    }`}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat.name} <ChevronRight />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right side - Subcategories */}
                <div className="flex-1 p-6">
                    {selectedCategory ? (
                        <>
                            <h2 className="text-base font-medium mb-4 flex items-center text-[#000000]">Select Sub Category <MoveRight /> {selectedCategory.name}</h2>
                            <ul className="grid grid-cols-1 gap-4">
                                {selectedCategory.subcategories.map((sub) => (
                                    <li
                                        key={sub.id}
                                        className={`justify-self-start w-full flex justify-between cursor-pointer p-3 border rounded-md text-center ${selectedSubcategory?.id === sub.id
                                            ? "bg-green-500 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => handleSubcategoryClick(sub)}
                                    >
                                        {sub.name} <ChevronRight />
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-500">Please select a category from the left.</p>
                    )}
                </div>
            </div>
        </>
    )
}
