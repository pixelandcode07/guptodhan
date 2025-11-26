import { VendorCategory } from '@/types/VendorCategoryType';
import VendorFormUserEnd from './components/VendorFormUserEnd';
import { fetchPublicVendorCategories } from '@/lib/MultiVendorApis/fetchVendorCategories';

export default async function CreateNewVendor() {

  const vendorCategories: VendorCategory[] = await fetchPublicVendorCategories();

  return (
    <div>
      <VendorFormUserEnd vendorCategories={vendorCategories} />
    </div>
  );
}
