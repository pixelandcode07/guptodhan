
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchAllReports } from '@/lib/BuyandSellApis/fetchAllReports';
import { getServerSession } from 'next-auth';
import ReportListing from './components/ReportListing';

export default async function ReportsPage() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!session || session.user.role !== 'admin') {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    const reports = await fetchAllReports(token!);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Reported Ads</h1>
            <ReportListing initialReports={reports} />
        </div>
    );
}