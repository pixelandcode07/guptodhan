import WithdrawalHistoryClient from './components/WithdrawalHistoryClient';

export const metadata = {
  title: 'Withdrawal History | Vendor Dashboard',
  description: 'View your past withdrawal requests and their statuses.',
};

export default function WithdrawHistoryPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdrawal History</h1>
      <WithdrawalHistoryClient />
    </div>
  );
}