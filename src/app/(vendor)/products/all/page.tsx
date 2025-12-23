import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendor_product_columns } from '@/components/TableHelper/vendor_product_columns';
import { fetchSingleVendorAds } from '@/lib/VendorApis/fetchSingleVendorAds';
import { getServerSession } from 'next-auth';



export default async function VendorProductPage() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.vendorId;
  // console.log("Vendor Id===", vendorId)
  const vendorData = await fetchSingleVendorAds(vendorId);
  // console.log("Store===", store)
  console.log("Products===", vendorData)



  return (
    <div>
      This is vendor product page.
      <main>
        <DataTable columns={vendor_product_columns} data={vendorData.products} />
      </main>
    </div>
  )
}
