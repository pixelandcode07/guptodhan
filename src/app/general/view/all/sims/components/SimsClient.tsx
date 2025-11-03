"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { type Sim } from "@/components/TableHelper/sim_columns";
import SimsHeader from "./SimsHeader";
import SimsFilters from "./SimsFilters";
import SimsTable from "./SimsTable";
import SimModal from "./SimModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
// import ResultDialog from "./ResultDialog";

// API types
interface ApiSim {
  _id: string;
  simTypeId: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Extended Sim type to include database ID
interface SimWithDbId extends Sim {
  dbId?: string; // Store the actual database _id
}

export default function SimsClient() {
  const { data: session } = useSession();
  const [sims, setSims] = useState<SimWithDbId[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SimWithDbId | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<SimWithDbId | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // const [duplicateOpen, setDuplicateOpen] = useState(false);
  // const [duplicateMessage, setDuplicateMessage] = useState<string | undefined>(undefined);
  // const [successOpen, setSuccessOpen] = useState(false);

  const fetchSims = useCallback(async () => {
    try {
      const token = (session as { accessToken?: string; user?: { role?: string } })?.accessToken;
      const userRole = (session as { accessToken?: string; user?: { role?: string } })?.user?.role;

      if (!token) {
        console.error("No authentication token available");
        setSims([]);
        return;
      }

      const response = await axios.get("/api/v1/product-config/productSimType", {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      const items: ApiSim[] = Array.isArray(response.data?.data) ? response.data.data : [];
      const mapped: SimWithDbId[] = items.map((sim, index) => ({
        id: index + 1,
        dbId: sim._id, // Store the actual database ID
        name: sim.name,
        status: sim.status === 'active' ? 'Active' : 'Inactive',
        created_at: sim.createdAt ? new Date(sim.createdAt).toLocaleString() : "",
      }));

      setSims(mapped);
    } catch (error) {
      console.error("Failed to fetch SIM types", error);
      toast.error("Failed to load SIM types. Please try again.");
      setSims([]);
    }
  }, [session]);

  useEffect(() => {
    fetchSims();
  }, [fetchSims]);

  const onSubmit = async (data: { name: string; status?: string }) => {
    const nameInput = (data.name || '').trim();
    const isEditing = !!editing;
    const opLabel = isEditing ? 'Updating' : 'Creating';

    // Client-side validation
    if (!nameInput) {
      toast.error('Please provide a SIM type name.');
      return;
    }

    // Client-side duplicate check for create path
    if (!isEditing) {
      const existsLocally = sims.some(s => s.name.toLowerCase() === nameInput.toLowerCase());
      if (existsLocally) {
        // setDuplicateMessage('A SIM type with this name already exists.');
        // setDuplicateOpen(true);
        toast.warning('A SIM type with this name already exists.');
        return;
      }
    }

    const toastId = toast.loading(`${opLabel} SIM type...`);

    try {
      const token = (session as { accessToken?: string; user?: { role?: string } })?.accessToken;
      const userRole = (session as { accessToken?: string; user?: { role?: string } })?.user?.role;

      if (!token) {
        toast.error('Authentication required. Please log in again.', { id: toastId });
        return;
      }

      if (isEditing) {
        // Update existing SIM via API
        await axios.patch(`/api/v1/product-config/productSimType/${editing.dbId}`, {
          name: nameInput,
          status: data.status === 'Inactive' ? 'inactive' : 'active',
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(userRole ? { 'x-user-role': userRole } : {}),
            'Content-Type': 'application/json',
          }
        });
        await fetchSims();
        toast.success('SIM type updated successfully!', { id: toastId });
      } else {
        // Create new SIM via API
        await axios.post(`/api/v1/product-config/productSimType`, {
          simTypeId: `sim_${Date.now()}`,
          name: nameInput,
          status: 'active',
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(userRole ? { 'x-user-role': userRole } : {}),
            'Content-Type': 'application/json',
          }
        });
        await fetchSims();
        toast.success('SIM type created successfully!', { id: toastId });
      }

      setOpen(false);
      setEditing(null);
    } catch (error: unknown) {
      // Handle duplicate / already exists scenario on create
      if (!editing && axios.isAxiosError(error)) {
        const status = error.response?.status;
        const respData = error.response?.data as unknown;
        const msgFromData = (respData && typeof respData === 'object' && 'message' in (respData as Record<string, unknown>)
          ? (respData as { message?: string }).message
          : undefined) || error.message;
        const rawString = typeof respData === 'string' ? respData : '';
        // Try to detect Mongo duplicate error across different shapes
        const text = `${msgFromData || ''} ${rawString}`;
        const hasDupSignature = /duplicate key|E11000|already exists/i.test(text);
        if (status === 409 || hasDupSignature) {
          toast.dismiss(toastId);
          // setDuplicateMessage('A SIM type with this name already exists.');
          // setDuplicateOpen(true);
          toast.warning('A SIM type with this name already exists.');
          return;
        }
      }
      console.error('Error saving SIM:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} SIM type`, { id: toastId });
    }
  };

  const onEdit = useCallback((sim: SimWithDbId) => {
    setEditing(sim);
    setOpen(true);
  }, []);

  const onDelete = useCallback((sim: SimWithDbId) => {
    setDeleting(sim);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      setDeleteLoading(true);
      const token = (session as { accessToken?: string; user?: { role?: string } })?.accessToken;
      const userRole = (session as { accessToken?: string; user?: { role?: string } })?.user?.role;
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }
      await axios.delete(`/api/v1/product-config/productSimType/${deleting.dbId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(userRole ? { "x-user-role": userRole } : {}),
        }
      });
      setSims(prev => prev.filter(s => s.dbId !== deleting.dbId));
      setDeleteOpen(false);
      setDeleting(null);
      // setSuccessOpen(true);
      toast.success("SIM type deleted successfully!");
    } catch (error) {
      console.error("Error deleting SIM type:", error);
      toast.error("Failed to delete SIM type");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, session]);

  const filteredSims = useMemo(() => {
    const bySearch = (s: SimWithDbId) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return s.name.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (s: SimWithDbId) => {
      if (!statusFilter) return true;
      return s.status === statusFilter;
    };
    
    const result = sims.filter((s) => bySearch(s) && byStatus(s));
    return result.map((s, idx) => ({ ...s, id: idx + 1 }));
  }, [sims, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <SimsHeader onAddClick={() => { setEditing(null); setOpen(true); }} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <SimsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <SimsTable
              sims={filteredSims}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Create/Edit Modal */}
        <SimModal 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={onSubmit} 
          editing={editing ? { name: editing.name, status: editing.status || "Active" } : null} 
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemName={deleting?.name}
          loading={deleteLoading}
          onConfirm={confirmDelete}
        />

        {/* Duplicate exists modal */}
        {/* <ResultDialog
          open={duplicateOpen}
          onOpenChange={setDuplicateOpen}
          title="Already exists"
          description={duplicateMessage}
          actionLabel="Close"
        /> */}
      </div>
    </div>
  );
}
