import { Customer } from "@/components/TableHelper/customer_columns";
import CustomersClient from './components/CustomersClient';
import { UserServices } from '@/lib/modules/user/user.service';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ViewAllCustomersPage() {
  try {
    await dbConnect();
    const users = await UserServices.getAllUsersFromDB();

    // Transform user data to customer format
    const customers: Customer[] = users.map((user: any, index: number) => ({
      id: index + 1,
      _id: user._id?.toString() || "",
      image: user.profilePicture || "",
      name: user.name || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
      address: user.address || "",
      delete_request_submitted: "",
      wallet: user.rewardPoints || 0,
      created_at: user.createdAt ? new Date(user.createdAt).toLocaleString() : "",
    }));

    return <CustomersClient initialRows={customers} />;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return empty data on error
    return <CustomersClient initialRows={[]} />;
  }
}
