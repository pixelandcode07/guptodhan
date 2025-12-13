import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(vendor)/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import DashNavbar from "@/components/DashboardComponent/DashNavbar";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-gray-50">
        <DashNavbar />
        <div className="p-6">
          {children}
        </div>
      </main>
      {/* <Toaster /> */}
    </SidebarProvider>
  );
}