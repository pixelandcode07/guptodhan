import SectionTitle from '@/components/ui/SectionTitle';
import AccountDeletionList from './components/AccountDeletionList';

export const metadata = {
  title: 'Account Deletion Requests | Guptodhan Admin',
};

export default function AccountDeletionPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <SectionTitle text="Account Deletion Requests" />
      <p className="text-gray-600 text-sm">
        Manage user requests to delete their accounts. Review the reasons and take appropriate action.
      </p>
      <AccountDeletionList />
    </div>
  );
}