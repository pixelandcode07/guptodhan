import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchAllServiceAds } from '@/lib/ServicePageApis/fetchAllServiceAds';
import { getServerSession } from 'next-auth';
import React from 'react';
import ClientDataTable from '../components/ClientDataTable';
import { redirect } from 'next/navigation'; // For redirecting if needed

export default async function AllServiceAds() {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;

    // Optional: Jodi login chara ei page dekha nished hoy
    // if (!token) {
    //     redirect('/login');
    // }

    // Fetch data safely
    const allAds = await fetchAllServiceAds(token);

    return (
        <div>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">See All Service Ads</span>
                </h1>
            </div>
            <main>
                {/* Data pass kora hocche */}
                <ClientDataTable allAds={allAds} />
            </main>
        </div>
    );
}