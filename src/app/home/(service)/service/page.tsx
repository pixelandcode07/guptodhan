import React, { Suspense } from 'react'
import ServiceBanner from '../components/ServiceBanner'
import ServiceCards from '../components/ServiceCards'
import ServiceCategory from '../components/ServiceCategory'

export default function MainServicePage() {
    return (
        <div className='container mx-auto bg-gray-100'>
            <section className='banner max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-10'>
                <Suspense fallback={<div>Loading Banner...</div>}>
                    <ServiceBanner />
                </Suspense>
            </section>
            <section className='category max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-10'>
                <Suspense fallback={<div>Loading Category...</div>}>
                    <ServiceCategory />
                </Suspense>
            </section>
            <section className='cards h-80 max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-10'>
                <Suspense fallback={<div>Loading Cards...</div>}>
                    <ServiceCards />
                </Suspense>
            </section>
        </div>
    )
}
