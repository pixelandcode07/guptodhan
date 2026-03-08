import AccountDeletionClient from './AccountDeletionClient';

export const metadata = {
  title: 'Account Deletion - Guptodhan',
  description: 'Request to delete your Guptodhan account and associated data.',
};

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Deletion Request</h1>
        
        <div className="prose text-gray-600 mb-8">
          <p>
            At Guptodhan, we value your privacy. If you wish to delete your account and all associated personal data from our app and servers, you can submit a request here.
          </p>
          <ul className="list-disc pl-5 mt-4">
            <li>Your profile information will be permanently deleted.</li>
            <li>Your order history and active services will be canceled/removed.</li>
            <li>This action cannot be undone.</li>
          </ul>
        </div>

        <AccountDeletionClient />
      </div>
    </div>
  );
}