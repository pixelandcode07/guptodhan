
import { getServerSession } from 'next-auth'
import ClientDataTable from '../components/ClientDataTable'
import { fetchAllProtectedServiceBanners } from '@/lib/ServicePageApis/fetchServiceBanner'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function AllServiceBanner() {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.accessToken;
    const allBanners = await fetchAllProtectedServiceBanners(token)
    // const allBanners = token
    //     ? await fetchAllProtectedServiceBanners(token)
    //     : [];
    console.log('allBanner', allBanners)
    return (
        <div>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">See All Service Categories</span>
                </h1>
            </div>

            <main>
                <ClientDataTable allBanners={allBanners} />
            </main>
        </div>
    )
}
