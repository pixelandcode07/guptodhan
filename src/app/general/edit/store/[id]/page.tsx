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
import EditStoreForm from "./EditStoreForm";

export default async function EditStorePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <div className="p-6 text-red-600">Access Denied. Admin only.</div>;
  }

  // 🟢 Securely fetch store data with token
  const store = await fetchStoreById(id, session.accessToken as string);

  if (!store) {
    return <div className="p-6 text-yellow-600">Store not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-3">
        Edit Store: {store.storeName}
      </h1>
      <EditStoreForm store={store} token={session.accessToken as string} />
    </div>
  );
}
