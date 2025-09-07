import SectionTitle from '@/components/ui/SectionTitle';
import PermissionUsersTable from './Components/PermissionUsersTable';

const apiRoutes = [
  {
    sl: 1,
    name: 'MD Siam madbar',
    email: 'siammadbor858@gmail.com',
    phone: '01724977798',
    address: 'Bangladesh',
    createAt: '2025-03-13 02:13:56 pm',
  },
];

export default function PermitionUsersPage() {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Permission Route List" />
      <div className="px-5">
        <PermissionUsersTable data={apiRoutes} />
      </div>
    </div>
  );
}
