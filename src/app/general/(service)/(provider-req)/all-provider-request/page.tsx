import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchAllProviderReq } from '@/lib/ServicePageApis/fetchAllProviderReq';
import { getServerSession } from 'next-auth';
import React from 'react'
import ClientDataTable from '../components/ClientDataTable';

// ✅ MAGIC FIX: Next.js এর এগ্রেসিভ ক্যাশিং বন্ধ করা হলো। এখন রিলোড দিলে ফ্রেশ ডাটা আসবে।
export const dynamic = 'force-dynamic'; 

export default async function ProviderReq() {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.accessToken;
    const allServiceUsers = await fetchAllProviderReq(token)
    
    return (
        <div>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">See All Provider Requests</span>
                </h1>
            </div>
            <main>
                <ClientDataTable serviceUsers={allServiceUsers} />
            </main>
        </div>
    )
}