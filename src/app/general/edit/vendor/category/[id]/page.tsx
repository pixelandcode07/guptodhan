import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchSingleVendorCategory } from '@/lib/MultiVendorApis/fetchSingleVendorCategory';
import EditVendorCategoryForm from '../components/EditVendorCategoryPage';

export default async function EditVendorCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // console.log("Params ID (after await):", id);

  const session = await getServerSession(authOptions);
  const token = session?.accessToken as string | undefined;

  if (!token) {
    return (
      <div className="p-6 text-red-600">
        <p>Access Denied. Please log in as admin.</p>
        <Link href="/auth/login">
          <Button variant="outline" className="mt-4">Go to Login</Button>
        </Link>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-6 text-red-600">
        <p>Invalid URL: Category ID is missing.</p>
        <Link href="/general/vendor-categories">
          <Button variant="outline" className="mt-4">Back to List</Button>
        </Link>
      </div>
    );
  }

  let category;
  try {
    category = await fetchSingleVendorCategory(id, token);
  } catch (error: any) {
    console.error("Failed to fetch category:", error.message);
    return (
      <div className="p-6 text-red-600">
        <p>{error.message}</p>
        <Link href="/general/view/vendor/categories">
          <Button variant="outline" className="mt-4">Back to List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="m-5 p-5 border rounded-lg bg-white">
      <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4 mb-6">
        Edit Vendor Category: {category.name}
      </h1>
      <EditVendorCategoryForm category={category} token={token} />
    </div>
  );
}