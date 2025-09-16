"use client";

import React from 'react'
import PageHeader from '../../../components/ReusableComponents/PageHeader'
import { ShopByCategory } from './ShopByCategory';

export default function Feature() {
    return (
        <div className="p-6 mt-10">
            <div className='flex justify-center'>
                <PageHeader
                    title="Featured Category"
                // buttonLabel="Add Feature"
                // onButtonClick={() => console.log("Add Feature clicked")}
                />
            </div>
            <main className="flex flex-col items-center justify-between">
                <ShopByCategory />
            </main>
        </div>
    )
}
