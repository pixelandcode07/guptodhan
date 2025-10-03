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
    <div className="flex w-full">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
          <DashNavbar />
          <div className="md:px-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}