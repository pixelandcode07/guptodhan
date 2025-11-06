import type { Metadata } from 'next';
import UserSidebar from '@/components/UserProfile/UserSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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
      {/* Mobile: side drawer for Account Menu */}
      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Menu className="w-4 h-4" />
              Account Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="border-b">
              <SheetTitle className="px-4 py-3">Account Menu</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full">
              <UserSidebar />
            </div>
          </SheetContent>
        </Sheet>
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
