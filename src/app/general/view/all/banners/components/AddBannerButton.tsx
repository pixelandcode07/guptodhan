"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddBannerButton() {
  const router = useRouter();

  const handleAddNewBanner = () => {
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
