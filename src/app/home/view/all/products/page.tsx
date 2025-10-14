// "use client"

import { flashSale } from '@/data/flash_sale_data'
import Image from 'next/image'
import React from 'react'

export default function ProductsPage() {
    return (
        <div className='max-w-7xl mx-auto py-15'>
            <h1 className="text-2xl font-bold mb-6">All Products</h1>
            <div className='grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8'>
                {flashSale.map((item, idx) => (
                    <div key={idx}>
                        <div className="image">
                            <Image 
                                src={item.productImage} 
                                alt={item.productName} 
                                width={200} 
                                height={200} 
                                className='w-full min-h-40' 
                            />
                        </div>
                        <div className="product-details ">
                            <h3 className='font-medium text-base'>{item.productName}</h3>
                            <p className='text-[#0084CB] font-medium text-base'>₹{item.productActualPrice}</p>
                            <p className='font-medium text-[10px]'>₹{item.productDiscountPrice}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
