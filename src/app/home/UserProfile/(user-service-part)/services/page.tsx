
import { getServerSession } from 'next-auth';
import ClientDataTable from '../components/ClientDataTable'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchProviderServices } from '@/lib/ServicePageApis/fetchProviderServices';

export default async function ServiceSec() {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.accessToken;
    const providerId = (session as any)?.user?.id;
    const providerService = await fetchProviderServices(providerId, token)

    return (
        <div className="p-4 mb-0">
            <h1 className="text-2xl font-semibold mb-4">My Services</h1>
            <main>
                <ClientDataTable providerServices={providerService} />
            </main>
        </div>
    )
}
