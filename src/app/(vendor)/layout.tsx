import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(vendor)/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-gray-50">
        <div className="p-6">
          <SidebarTrigger />
          {children}
        </div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}