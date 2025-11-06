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
    <div className="max-w-7xl mx-auto w-full px-4 py-6">
      {/* Mobile: collapsible sidebar */}
      <div className="md:hidden mb-4">
        <details className="bg-white border rounded-md overflow-hidden">
          <summary className="list-none cursor-pointer select-none px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-gray-900">Account Menu</span>
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="border-t">
            <UserSidebar />
          </div>
        </details>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-72 md:shrink-0">
          <div className="bg-white border rounded-md overflow-hidden md:sticky md:top-4">
            <UserSidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-white border rounded-md overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
