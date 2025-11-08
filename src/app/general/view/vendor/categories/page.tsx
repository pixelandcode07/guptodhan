
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchVendorCategories } from "@/lib/MultiVendorApis/fetchVendorCategories";
import { VendorCategory } from "@/types/VendorCategoryType";
import { getServerSession } from "next-auth";
import ClientDataTable from "./components/ClientDataTable";

export default async function BusinessCategories() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken as string | undefined;
  console.log("token",token)

  if (!token) {
    return (
      <div className="m-5 p-5 border rounded-lg bg-red-50 text-red-700">
        <p className="font-semibold">Access Denied</p>
        <p>You must be logged in as an admin to view this page clearance.</p>
      </div>
    );
  }

  const vendorCategories: VendorCategory[] = await fetchVendorCategories(token);

  return (
    <div className="m-5 p-5 border">
      <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4 mb-6">
        Category List
      </h1>

      {/* Client wrapper handles state */}
      <ClientDataTable initialData={vendorCategories} />
    </div>
  );
}