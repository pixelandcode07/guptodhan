import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendor_product_columns } from '@/components/TableHelper/vendor_product_columns';
import { fetchSingleVendorAds } from '@/lib/VendorApis/fetchSingleVendorAds';
import { getServerSession } from 'next-auth';
import ClientDataTable from './components/ClientDataTable';



export default async function VendorProductPage() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.vendorId;
  const vendorData = await fetchSingleVendorAds(vendorId);
  // console.log("Products===", vendorData)



  return (
    <div>
      <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4 mb-6">
        See All Your Products
      </h1>
      <main>
        <ClientDataTable vendorData={vendorData.products} />
      </main>
    </div>
  )
}
