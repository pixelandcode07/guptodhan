import { getServerSession } from 'next-auth';
import ClientDataTable from '../components/ClientDataTable'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchProviderServices } from '@/lib/ServicePageApis/fetchProviderServices';
import Link from 'next/link'; // ✅ Link ইম্পোর্ট করা হলো
import { ShoppingBag } from 'lucide-react'; // ✅ আইকন ইম্পোর্ট করা হলো

export default async function ServiceSec() {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (session as any)?.accessToken;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const providerId = (session as any)?.user?.id;
    const providerService = await fetchProviderServices(providerId, token)

    return (
        <div className="p-4 mb-0">
            {/* ✅ My Services Heading এবং Shop Now বাটন */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">My Services</h1>
                
                <Link 
                    href="/products" 
                    className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                </Link>
            </div>
            
            <main>
                <ClientDataTable providerServices={providerService} />
            </main>
        </div>
    )
}