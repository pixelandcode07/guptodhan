import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import AllBookingsClient from './components/AllBookingsClient';

export const metadata = {
  title: 'All Service Bookings | Guptodhan Admin',
};

export default async function AllBookingsPage() {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="border-l-4 border-blue-500 pl-4">
        <h1 className="text-xl font-bold text-gray-800">All Service Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all service booking requests</p>
      </div>
      <AllBookingsClient token={token} />
    </div>
  );
}