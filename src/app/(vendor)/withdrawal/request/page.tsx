import WithdrawalRequestClient from './components/WithdrawalRequestClient';

export const metadata = {
  title: 'Withdrawal Request | Vendor Dashboard',
  description: 'Request for a withdrawal from your available balance.',
};

export default function WithdrawReqPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Request Withdrawal</h1>
      <WithdrawalRequestClient />
    </div>
  );
}