"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { Banner, getBannerColumns } from "@/components/TableHelper/banner_columns";
import AddBannerButton from "./components/AddBannerButton";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import SuccessModal from "./components/SuccessModal";
import EditBannerModal from "./components/EditBannerModal";
import BannersSkeleton from "./components/BannersSkeleton";
import RearrangeButton from "@/components/ReusableComponents/RearrangeButton";


export default function BannersPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get authentication data from session
  type SessionWithToken = { accessToken?: string; user?: { role?: string } };
  const sessionWithToken = session as SessionWithToken | null;
  const token = sessionWithToken?.accessToken;
  const userRole = sessionWithToken?.user?.role;
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '', action: '' });
  
  // Handler functions for edit and delete actions
  const handleEdit = (id: string) => {
    const banner = data.find(b => b._id === id);
    if (banner) {
      setSelectedBanner(banner);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const banner = data.find(b => b._id === id);
    if (banner) {
      setSelectedBanner(banner);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBanner) return;
    
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/v1/ecommerce-banners/${selectedBanner._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      
      if (response.data.success) {
        setDeleteModalOpen(false);
        setSuccessMessage({
          title: 'Banner Deleted',
          message: `"${selectedBanner.bannerTitle}" has been successfully deleted.`,
          action: ''
        });
        setSuccessModalOpen(true);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error: unknown) {
      console.error('Error deleting banner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete banner';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = () => {
    setEditModalOpen(false);
    setSuccessMessage({
      title: 'Banner Updated',
      message: `"${selectedBanner?.bannerTitle}" has been successfully updated.`,
      action: ''
    });
    setSuccessModalOpen(true);
    fetchBanners(); // Refresh the list
  };

  // Fetch banners from API
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/ecommerce-banners', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error('Failed to fetch banners');
      }
    } catch (error: unknown) {
      console.error('Error fetching banners:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch banners';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Get columns with handlers
  const columns = getBannerColumns(handleEdit, handleDelete);
  
  if (loading) {
    return <BannersSkeleton />;
  }
  
  return (
    <div className="m-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Banners</h1>
        <div className="flex items-center gap-2">
          <AddBannerButton />
          <RearrangeButton href="/general/rearrange/banners" label="Rearrange Banners" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 w-full overflow-x-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        bannerTitle={selectedBanner?.bannerTitle || ''}
        isDeleting={isDeleting}
      />
      
      <EditBannerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        banner={selectedBanner}
        onSuccess={handleUpdateSuccess}
      />
      
      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title={successMessage.title}
        message={successMessage.message}
        action={successMessage.action}
      />
    </div>
  );
}
