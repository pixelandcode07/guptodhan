export const dynamic = "force-dynamic"; // ⚡️ Add this to prevent build-time fetch error

import { fetchAllStores } from '@/lib/MultiVendorApis/fetchAllStore';
import ClientDataTableStore from './components/ClientDataTableStore';
import { StoreInterface } from '@/types/StoreInterface';

export default async function ViewAllStores() {
  const stores: StoreInterface[] = await fetchAllStores();
  // console.log("stores", stores);

  return (
    <div className="m-5 p-5 border rounded-lg bg-white shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-3">
          Store List
        </h1>
      </div>

      {stores.length > 0 ? (
        <ClientDataTableStore initialData={stores} />
      ) : (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-lg">No stores found or failed to load data.</p>
        </div>
      )}
    </div>
  );
}
