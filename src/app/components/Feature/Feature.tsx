"use client";

import React from 'react'
import PageHeader from '../../../components/ReusableComponents/PageHeader'
import { ShopByCategory } from './ShopByCategory';

export default function Feature() {
    return (
        <div className="bg-gray-100 my-3 md:p-6 mt-2">
            <div className='hidden lg:flex justify-center'>
                <PageHeader
                    title="Featured Category"
                // buttonLabel="Add Feature"
                // onButtonClick={() => console.log("Add Feature clicked")}
                />
            </div>
            <div className=' lg:hidden'>
                <PageHeader
                    title="Featured Category"
                    buttonLabel="View All"
                    onButtonClick={() => console.log("Add Feature clicked")}
                />
            </div>
            <main className="flex flex-col items-center justify-between">
                <ShopByCategory />
            </main>
        </div>
    )
}
