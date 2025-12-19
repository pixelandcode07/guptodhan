import SubscribedUsersClient from "./components/SubscribedUsersClient"
import { UserServices } from '@/lib/modules/user/user.service';
import dbConnect from '@/lib/db';
import { SubscribedUserRow } from '@/components/TableHelper/subscribed_users_columns';

export const dynamic = 'force-dynamic';

export default async function ViewAllSubscribedUsersPage() {
  try {
    await dbConnect();
    const users = await UserServices.getAllUsersFromDB();

    const subscribedUsers: SubscribedUserRow[] = users.map((user: any, index: number) => ({
      id: user._id?.toString() || "",
      sl: index + 1,
      email: user.email || "",
      subscribedOn: user.createdAt ? new Date(user.createdAt).toLocaleString() : "",
    }));

    return (
      <div className="max-w-[1400px] mx-auto">
        <SubscribedUsersClient initialRows={subscribedUsers} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return (
      <div className="max-w-[1400px] mx-auto">
        <SubscribedUsersClient initialRows={[]} />
      </div>
    );
  }
}


