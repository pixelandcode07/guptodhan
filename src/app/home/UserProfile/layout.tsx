import type { Metadata } from 'next';
import UserSidebar from '@/components/UserProfile/UserSidebar';

export const metadata: Metadata = {
  title: 'User Profile',
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 max-w-7xl mx-auto w-full px-4 py-6 items-stretch">
      <div className="w-72 shrink-0 bg-white border rounded-md overflow-hidden">
        <UserSidebar />
      </div>

      <main className="flex-1 bg-white border rounded-md">
        {children}
      </main>
    </div>
  );
}
