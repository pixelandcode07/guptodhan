// // app/admin/vendors/VendorRequest.tsx
import { DataTable } from '@/components/TableHelper/data-table';
import { vendor_req_columns } from '@/components/TableHelper/vendor_req_columns';
import { fetchAllVendors } from '@/lib/MultiVendorApis/fetchAllVendors';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Vendor } from '@/types/VendorType';

export default async function VendorRequest() {
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

    const vendors: Vendor[] = await fetchAllVendors(token);

    return (
        <div className="m-5 p-5 border rounded-lg bg-white">
            <div className="mb-6">
                <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-3">
                    Vendor Requests
                </h1>
            </div>
            {vendors.length === 0 ? (
                <p className="text-gray-500">No vendor requests found.</p>
            ) : (
                <DataTable columns={vendor_req_columns} data={vendors} />
            )}
        </div>
    );
}


// // app/admin/vendors/VendorRequest.tsx
// export const dynamic = 'force-dynamic'; // ক্যাশিং বন্ধ

// import { DataTable } from '@/components/TableHelper/data-table';
// import { vendor_req_columns } from '@/components/TableHelper/vendor_req_columns';
// import { fetchAllVendors } from '@/lib/MultiVendorApis/fetchAllVendors';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { Vendor } from '@/types/VendorType';

// export default async function VendorRequest() {
//     const session = await getServerSession(authOptions);
//     const token = session?.accessToken as string | undefined;

//     if (!token) {
//         return (
//             <div className="m-5 p-5 border rounded bg-red-50 text-red-700">
//                 <p className="font-semibold">Access Denied</p>
//                 <p>You must be logged in as an admin.</p>
//             </div>
//         );
//     }

//     const vendors: Vendor[] = await fetchAllVendors(token);

//     return (
//         <div className="m-5 p-5 border rounded-lg bg-white">
//             <div className="mb-6">
//                 <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-3">
//                     Vendor Requests
//                 </h1>
//             </div>
//             {vendors.length === 0 ? (
//                 <p className="text-gray-500">No vendor requests found.</p>
//             ) : (
//                 <DataTable columns={vendor_req_columns} data={vendors} />
//             )}
//         </div>
//     );
// }