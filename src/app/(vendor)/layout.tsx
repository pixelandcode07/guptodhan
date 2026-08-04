import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(vendor)/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import DashNavbar from "@/components/DashboardComponent/DashNavbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const session = await getServerSession(authOptions);
    if (!session?.user) {
    return <div className="p-6">Please log in to view dashboard.</div>;
  }

  const vendorId = session?.user?.vendorId;
  const accessToken = session?.accessToken;

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL || 'https://guptodhan.com';

let storeData = {
  storeName: "",
  storeLogo: "",
};

if (session?.user?.vendorId) {
  try {
    const res = await fetch(
      `${baseUrl}/api/v1/vendor-store/vendorId/${vendorId}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const json = await res.json();

      storeData = {
        storeName: json.data?.storeName || "",
        storeLogo: json.data?.storeLogo || "",
      };
    }
  } catch (err) {
    console.error(err);
  }
}
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
       storeName={storeData.storeName}
    storeLogo={storeData.storeLogo}
      />
      <main className="flex-1 min-h-screen bg-gray-50">
        <DashNavbar />
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}