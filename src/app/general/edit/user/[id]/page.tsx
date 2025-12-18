import { notFound } from 'next/navigation';
import EditUserForm from './EditUserForm';
import dbConnect from '@/lib/db';
import { UserServices } from '@/lib/modules/user/user.service';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  // ১. params আনর‍্যাপ করা
  const { id } = await params;

  // ২. সরাসরি সার্ভিস কল করা (fetch এর বদলে)
  await dbConnect();
  const user = await UserServices.getUserByIdFromDB(id);

  if (!user) {
    notFound();
  }

  // ৩. ফর্মের জন্য ডাটা ম্যাপ করা
  const userData = {
    _id: user._id?.toString() || '',
    name: user.name || '',
    email: user.email || '',
    profilePicture: user.profilePicture || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    role: user.role as 'user' | 'vendor' | 'service-provider' | 'admin',
    isVerified: user.isVerified || false,
    isActive: user.isActive ?? true,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
             <h1 className="text-2xl font-bold text-gray-800">Edit System User</h1>
             <p className="text-sm text-gray-500 font-mono">ID: {id}</p>
          </div>
          <EditUserForm initialData={userData} />
        </div>
      </div>
    </div>
  );
}