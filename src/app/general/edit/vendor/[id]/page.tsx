import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchVendorById } from '@/lib/MultiVendorApis/vendorActions';
import EditVendorForm from '../components/EditVendorForm';
// import { fetchVendorById } from '@/lib/MultiVendorApi/fetchVendorById';
// import EditVendorForm from '@/components/EditVendorForm';

export default async function EditVendorPage({ params }: { params: { id: string } }) {
    const {id} = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return <div className="p-6 text-red-600">Access Denied. Admin only.</div>;
  }

  const vendor = await fetchVendorById(id, session.accessToken as string);

  if (!vendor) {
    return <div className="p-6 text-yellow-600">Vendor not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-3">
        Edit Vendor: {vendor.businessName}
      </h1>
      {/* টোকেন + ভেন্ডর পাস করো */}
      <EditVendorForm vendor={vendor} token={session.accessToken as string} />
    </div>
  );
}