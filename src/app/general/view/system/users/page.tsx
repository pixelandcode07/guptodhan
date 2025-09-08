import { seystem_users_columns } from '@/components/TableHelper/system_users_columns';
import SectionTitle from '@/components/ui/SectionTitle';
import UsersFilter from './Components/UserFilter';

// Example data (fetched from server)
const userData = [
  {
    id: 1,
    name: 'Amir Hamja',
    email: 'amir@gmail.com',
    phone: '01816500800',
    address: 'Dhaka',
    createDate: '2025-06-24 12:04:11 pm',
    userType: 'Revoke SuperAdmin',
  },
  {
    id: 2,
    name: 'Amir Hamja',
    email: 'amir@gmail.com',
    phone: '01816500800',
    address: 'Dhaka',
    createDate: '2025-06-24 12:04:11 pm',
    userType: 'Make SuperAdmin',
  },
];

export default function UsersPage() {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="System Users List" />

      <div className="px-5">
        {/* Client-side Filter/Search */}
        <UsersFilter data={userData} columns={seystem_users_columns} />
      </div>
    </div>
  );
}
