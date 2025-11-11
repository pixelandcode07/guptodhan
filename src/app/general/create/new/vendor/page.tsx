import React from 'react'
import CreateVendorForm from './components/CreateVendorForm'
import { fetchVendorCategories } from '@/lib/MultiVendorApis/fetchVendorCategories';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { VendorCategory } from '@/types/VendorCategoryType';


export default async function CreateNewVendor() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    console.log("token", token)

    if (!token) {
        return (
            <div className="m-5 p-5 border rounded-lg bg-red-50 text-red-700">
                <p className="font-semibold">Access Denied</p>
                <p>You must be logged in as an admin to view this page clearance.</p>
            </div>
        );
    }

    const vendorCategories: VendorCategory[] = await fetchVendorCategories(token);
    // console.log("vendorCategories", vendorCategories);


    return (
        <div className='max-w-2xl mx-auto'>
            <CreateVendorForm vendorCategories={vendorCategories} />
        </div>
    )
}
