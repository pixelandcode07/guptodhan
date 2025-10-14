import SectionTitle from '@/components/ui/SectionTitle';
import axios from 'axios';
import UserTabile from './Components/UserTabile';

const fetchUser = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/system-user`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function UsersPage() {
  const userData = await fetchUser();

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="System Users List" />

      <div className="px-5">
        <UserTabile data={userData.data || []} />
      </div>
    </div>
  );
}
