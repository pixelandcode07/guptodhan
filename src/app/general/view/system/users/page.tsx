import { UserServices } from '@/lib/modules/user/user.service';
import dbConnect from '@/lib/db';
import { SystemUserRow } from '@/components/TableHelper/system_users_columns';
import SystemUsersClient from '../../all/subscribed/users/components/SystemUsersClient';

export const dynamic = 'force-dynamic';

export default async function ViewAllSystemUsersPage() {
  try {
    await dbConnect();
    // Fetch all users from the database
    const users = await UserServices.getAllUsersFromDB();

    // Map the database response to our table row format
    const mappedUsers: SystemUserRow[] = users.map((user: any, index: number) => ({
      _id: user._id?.toString() || "",
      sl: index + 1,
      name: user.name || "Unknown",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      profilePicture: user.profilePicture || "",
      role: user.role || "user",
      isActive: user.isActive ?? true,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1500px] mx-auto">
          <SystemUsersClient initialUsers={mappedUsers} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1500px] mx-auto text-center text-red-500 py-20 font-bold">
          Failed to load users. Please check your database connection.
        </div>
      </div>
    );
  }
}