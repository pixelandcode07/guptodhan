import { VendorCategory } from '@/types/VendorCategoryType';
import VendorFormUserEnd from './components/VendorFormUserEnd';
import { fetchPublicVendorCategories } from '@/lib/MultiVendorApis/fetchVendorCategories';

export default async function CreateNewVendor() {

  const vendorCategories: VendorCategory[] = await fetchPublicVendorCategories();
  // console.log('Fetched Vendor Categories:', vendorCategories);

  return (
    <div>
      <VendorFormUserEnd vendorCategories={vendorCategories} />
    </div>
  );
}
