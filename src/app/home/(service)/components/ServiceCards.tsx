import { fetchActiveService } from '@/lib/ServicePageApis/fetchActiveService'
import React from 'react'
import ServiceCard from './Re-useable/ServiceCard';
import PageHeader from '@/components/ReusableComponents/PageHeader';

export default async function ServiceCards() {
    const serviceCard = await fetchActiveService();
    return (
        <>
            <div className='flex justify-center items-center'>
                <PageHeader title="Our Services" />
            </div>

            {/* Mobile: 2 column grid | Desktop: 1 column list */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                {serviceCard.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </div>
        </>
    )
}