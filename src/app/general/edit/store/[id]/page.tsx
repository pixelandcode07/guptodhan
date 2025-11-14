// import React from 'react'

// export default function EditStore() {
//   return (
//     <div>
//       This is the edit store page.
//     </div>
//   )
// }
// app/general/edit/store/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchStoreById } from "@/lib/MultiVendorApis/storeActions";
import EditStoreForm from "../components/EditStoreForm";
import { StoreInterface } from "@/types/StoreInterface";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stores = await fetchStoreById(id);
  // fetchStoreById returns an array; pick the first element as the single store
  const store: StoreInterface | null = Array.isArray(stores) ? stores[0] ?? null : (stores as unknown as StoreInterface);

  console.log("Store data==>", store)

  if (!store) {
    return <div className="p-6 text-yellow-600">Store not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-3">
        Edit Store: {store.storeName}
      </h1>
      <EditStoreForm store={store} />
    </div>
  );
}
