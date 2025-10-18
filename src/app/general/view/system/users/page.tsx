import SectionTitle from '@/components/ui/SectionTitle';
import UserTabile from './Components/UserTabile';
import { UserServices } from '@/lib/modules/user/user.service'; // ✅ Import your service directly
import dbConnect from '@/lib/db'; // ✅ Import your database connection

// This is now an async Server Component
export default async function UsersPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  // Assuming you have a service function to get all users
  const usersData = await UserServices.getAllUsersFromDB();

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="System Users List" />
      <div className="px-5">
        {/* Pass the fetched data as a prop to the client component.
          JSON.parse(JSON.stringify(...)) converts the Mongoose document
          to a plain object, which is safe to pass from Server to Client Components.
        */}
        <UserTabile data={JSON.parse(JSON.stringify(usersData))} />
      </div>
    </div>
  );
}