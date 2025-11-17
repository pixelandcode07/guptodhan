import { fetchVendorCategories } from '@/lib/MultiVendorApis/fetchVendorCategories';
import { VendorCategory } from '@/types/VendorCategoryType';
import VendorFormUserEnd from './components/VendorFormUserEnd';

export default async function CreateNewVendor() {
  // vendor categories do NOT require login
  const vendorCategories: VendorCategory[] = await fetchVendorCategories();

  return (
    <div>
      <VendorFormUserEnd vendorCategories={vendorCategories} />
    </div>
  );
}
