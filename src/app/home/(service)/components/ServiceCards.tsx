import { fetchActiveService } from '@/lib/ServicePageApis/fetchActiveService'
import React from 'react'
import ServiceCard from './Re-useable/ServiceCard';
import PageHeader from '@/components/ReusableComponents/PageHeader';

export default async function ServiceCards() {
    const serviceCard = await fetchActiveService();
    return (
        <>
            <div className='flex justify-center items-center'>
                <PageHeader
                title="Our Services"
                />
            </div>
            <div className="px-2 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {serviceCard.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </div>
        </>

    )
}
