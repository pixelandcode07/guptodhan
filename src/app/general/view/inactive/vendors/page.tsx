import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { inactive_vendor_columns } from '@/components/TableHelper/inactive_vendor_columns';
import { fetchVendors } from '@/lib/MultiVendorApis/fetchVendors';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export default async function ApprovedVendors() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!token) {
        return (
            <div className="m-5 p-5 border rounded bg-red-50 text-red-700">
                <p className="font-semibold">Access Denied</p>
                <p>You must be logged in as an admin.</p>
            </div>
        );
    }
    const rawVendors = await fetchVendors(token);

    const inactiveVendors = rawVendors.filter(
        (v: Vendor) => v.status === "rejected"
    );

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black border-l-4 border-blue-500 pl-3">
                    In Active Vendors
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Total InActive Vendors: <strong>{inactiveVendors.length}</strong>
                </p>
            </div>

            {inactiveVendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No inactive vendors found at the moment.</p>
                </div>
            ) : (
                <DataTable columns={inactive_vendor_columns} data={inactiveVendors} />
            )}
        </div>
    );
}