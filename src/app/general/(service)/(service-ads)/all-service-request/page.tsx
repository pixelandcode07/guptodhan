import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchAllServiceAds } from '@/lib/ServicePageApis/fetchAllServiceAds';
import { getServerSession } from 'next-auth';
import React from 'react'
import ClientDataTable from '../components/ClientDataTable';

export default async function AllServiceAds() {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.accessToken;
    const allAds = await fetchAllServiceAds(token)
    return (
        <div>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">See All Service Ads</span>
                </h1>
            </div>
            <main>
                <ClientDataTable allAds={allAds} />
            </main>
        </div>
    )
}
