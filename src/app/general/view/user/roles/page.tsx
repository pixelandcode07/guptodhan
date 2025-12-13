import SectionTitle from '@/components/ui/SectionTitle';
import UserRolesTable from './Components/UserRolesTable';

// Example data (can be fetched from API)
const apiRoutes = [
  {
    sl: 1,
    roleName: 'Producting',
    desc: 'Producting',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
];

export default function PermitionUsersPage() {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="User Route List" />
      <div className="px-5">
        <UserRolesTable data={apiRoutes} />
      </div>
    </div>
  );
}
