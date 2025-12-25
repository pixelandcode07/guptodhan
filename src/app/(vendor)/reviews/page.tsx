import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { store_data_with_review_columns } from '@/components/TableHelper/store_data_with_review_colums';
import { fetchVendorStoreWithReviews } from '@/lib/VendorApis/fetchVendorStoreWithReviews';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function Reviews() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.vendorId;
  const store_data_with_review = await fetchVendorStoreWithReviews(vendorId);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendor Store Reviews</h1>
      <main>
        <DataTable columns={store_data_with_review_columns} data={store_data_with_review.products} />
      </main>
    </div>
  )
}
