import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import EditCategoryForm from '../components/EditCategoryForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken as (string | undefined);
  const userRole = (session as any)?.user?.role as (string | undefined);

  // Fetch category details by _id; fall back to scanning all if needed
  const all = await CategoryServices.getAllCategoriesFromDB();
  const category = all.find((c: any) => String(c._id) === String(id));

  if (!category) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Category not found</h1>
          <p className="text-sm text-gray-600 mb-4">We couldn't locate a category with the provided ID.</p>
          <Link href="/general/view/all/category">
            <Button variant="outline">Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Category: {category.name}</h1>
              <p className="text-sm text-gray-600">Update details and media for this category</p>
            </div>
            <Link href="/general/view/all/category">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        <EditCategoryForm category={JSON.parse(JSON.stringify(category))} token={token} userRole={userRole} />
      </div>
    </div>
  );
}


