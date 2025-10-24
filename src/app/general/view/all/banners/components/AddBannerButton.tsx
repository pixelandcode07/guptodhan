"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AddBannerButton() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Get authentication data from session
  type SessionWithToken = { accessToken?: string; user?: { role?: string } };
  const sessionWithToken = session as SessionWithToken | null;
  const userRole = sessionWithToken?.user?.role;

  const handleAddNewBanner = () => {
    // Security check - only allow admin users
    if (userRole !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    router.push('/general/add/new/banner');
  };

  return (
    <Button 
      onClick={handleAddNewBanner}
      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add New Banner
    </Button>
  );
}
