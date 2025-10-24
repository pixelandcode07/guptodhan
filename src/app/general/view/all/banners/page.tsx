"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { Banner, getBannerColumns } from "@/components/TableHelper/banner_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import AddBannerButton from "./components/AddBannerButton";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import SuccessModal from "./components/SuccessModal";
import EditBannerModal from "./components/EditBannerModal";
import FancyLoadingPage from "@/app/general/loading";


export default function BannersPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get authentication data from session
  type SessionWithToken = { accessToken?: string; user?: { role?: string } };
  const sessionWithToken = session as SessionWithToken | null;
  const token = sessionWithToken?.accessToken;
  const userRole = sessionWithToken?.user?.role;
  
  // Security check - only allow admin users
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-red-600 font-semibold text-xl mb-3">Access Denied</div>
          <p className="text-red-500">You need admin privileges to manage banners.</p>
        </div>
      </div>
    );
  }
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '', action: '' });
  
  // Handler functions for edit and delete actions
  const handleEdit = (id: string) => {
    // Security check - only allow admin users to edit
    if (userRole !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    const banner = data.find(b => b._id === id);
    if (banner) {
      setSelectedBanner(banner);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    // Security check - only allow admin users to delete
    if (userRole !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    const banner = data.find(b => b._id === id);
    if (banner) {
      setSelectedBanner(banner);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBanner) return;
    
    // Security check - only allow admin users to delete
    if (userRole !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      setDeleteModalOpen(false);
      setSelectedBanner(null);
      return;
    }
    
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/v1/ecommerce-banners/${selectedBanner._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-role': userRole || '',
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
          Authorization: `Bearer ${token}`,
          'x-user-role': userRole || '',
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
  }, [token]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Get columns with handlers
  const columns = getBannerColumns(handleEdit, handleDelete);
  
  if (loading) {
    return <FancyLoadingPage />;
  }
  
  return (
    <div className="m-5 p-5 border">
      <div className="mb-6">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Banners List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end mb-4">
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input type="text" className="border border-gray-500 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <AddBannerButton />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Rearrange Banners
            </Button>
          </div>
        </div>
      </div>
      
      <DataTable columns={columns} data={data} />
      
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
