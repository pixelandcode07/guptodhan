// src/app/general/edit/user/[id]/page.tsx
import { notFound } from 'next/navigation';
import EditUserForm from './EditUserForm';

// Server Component - Fetch user data
async function getUserById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch user');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  const userData = {
    _id: user._id,
    name: user.name || '',
    email: user.email || '',
    profilePicture: user.profilePicture || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    serviceProviderInfo: user.serviceProviderInfo || { subCategories: [] },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit User</h1>
          <EditUserForm initialData={userData} />
        </div>
      </div>
    </div>
  );
}