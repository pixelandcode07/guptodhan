export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import AppSidebar from '@/components/DashboardComponent/AppSidebar';
import DashNavbar from '@/components/DashboardComponent/DashNavbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <div className="flex w-full overflow-x-hidden">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full overflow-x-hidden">
          <DashNavbar />
          <div className="md:px-4 overflow-x-hidden">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}