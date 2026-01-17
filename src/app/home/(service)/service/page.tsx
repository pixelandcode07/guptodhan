import React, { Suspense } from 'react'
import ServiceBanner from '../components/ServiceBanner'
import ServiceCards from '../components/ServiceCards'
import ServiceCategory from '../components/ServiceCategory'
import { ServiceBannerSkeleton, ServiceCardsSkeleton, ServiceCategorySkeleton } from './ServiceSkeleton'

export default function MainServicePage() {
    return (
        <div className='container mx-auto bg-white'>
            <section className='banner max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-4'>
                <Suspense fallback={<ServiceBannerSkeleton />}>
                    <ServiceBanner />
                </Suspense>
            </section>
            <section className='category max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-4'>
                <Suspense fallback={<ServiceCategorySkeleton />}>
                    <ServiceCategory />
                </Suspense>
            </section>
            <section className='cards h-80 max-w-[95vw] xl:max-w-[90vw] mx-auto md:px-4 md:pt-4'>
                <Suspense fallback={<ServiceCardsSkeleton />}>
                    <ServiceCards />
                </Suspense>
            </section>
        </div>
    )
}


