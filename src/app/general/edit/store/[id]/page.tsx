import { fetchStoreById } from "@/lib/MultiVendorApis/storeActions";
import EditStoreForm from "../components/EditStoreForm";
import { StoreInterface } from "@/types/StoreInterface";
import { notFound } from "next/navigation";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ 404 ফিক্স: আইডি না থাকলে বা undefined হলে সেফলি 404 পেজে পাঠাবে
  if (!id || id === "undefined" || id.trim() === "") {
    notFound();
  }

  const stores = await fetchStoreById(id);
  const store: StoreInterface | null = Array.isArray(stores) ? stores[0] ?? null : (stores as unknown as StoreInterface);

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