import React from 'react'
import ServiceBanner from '../components/ServiceBanner'
import ServiceCards from '../components/ServiceCards'
import ServiceCategory from '../components/ServiceCategory'

export default function MainServicePage() {
    return (
        <div className='container mx-auto bg-gray-100'>
            <section className='banner h-80 max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 md:pt-10'>
                <ServiceBanner />
            </section>
            <section className='category max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 md:pt-10'>
                <ServiceCategory />
            </section>
            <section className='cards h-80 max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 md:pt-10'>
                <ServiceCards />
            </section>
        </div>
    )
}
