"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type Storage } from "@/components/TableHelper/storage_columns";
import StoragesHeader from "./StoragesHeader";
import StoragesFilters from "./StoragesFilters";
import StoragesTable from "./StoragesTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import StorageModal from "./StorageModal";

type ApiStorage = {
  _id: string;
  storageTypeId: string;
  ram: string;
  rom: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function StoragesClient() {
  const { data: session } = useSession();
  type AugmentedSession = { accessToken?: string; user?: { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [storages, setStorages] = useState<Storage[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Storage | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Storage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStorages = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/product-config/storageType", { params: { _ts: Date.now() } });
      const items: ApiStorage[] = res.data.data;
      const mapped: Storage[] = items.map((it, index) => ({
        _id: it._id,
        storageTypeId: it.storageTypeId,
        id: index + 1,
        ram: it.ram,
        rom: it.rom,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setStorages(mapped);
    } catch (e) {
      console.error("Error fetching storages:", e);
      toast.error("Failed to fetch storage types");
    }
  }, []);

  useEffect(() => { fetchStorages(); }, [fetchStorages]);

  const deriveStorageTypeId = (ram: string, rom: string) => `${ram}-${rom}`.toLowerCase().replace(/\s+/g, '-');

  const onSubmit = async (data: { ram: string; rom: string; status?: string }) => {
    try {
      const payload: Record<string, unknown> = {
        storageTypeId: deriveStorageTypeId(data.ram, data.rom),
        ram: data.ram,
        rom: data.rom,
        ...(editing && data.status ? { status: data.status } : {}),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/storageType/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Storage updated successfully!");
        setStorages(prev => prev.map(r => r._id === editing._id ? {
          ...r,
          ram: payload.ram as string,
          rom: payload.rom as string,
          status: (payload.status === 'inactive') ? 'Inactive' : 'Active',
        } : r));
      } else {
        const res = await axios.post(`/api/v1/product-config/storageType`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        const created: ApiStorage | undefined = res?.data?.data;
        if (created) {
          setStorages(prev => [{
            _id: created._id,
            storageTypeId: created.storageTypeId,
            id: (prev[0]?.id ?? 0) + 1,
            ram: created.ram,
            rom: created.rom,
            status: created.status === 'inactive' ? 'Inactive' : 'Active',
            created_at: created.createdAt || new Date().toISOString(),
          }, ...prev]);
        }
        toast.success("Storage created successfully!");
      }

      setOpen(false);
      setEditing(null);
      await fetchStorages();
    } catch (e) {
      console.error("Error saving storage:", e);
      toast.error(`Failed to ${editing ? 'update' : 'create'} storage`);
    }
  };

  const onEdit = useCallback((storage: Storage) => {
    setEditing(storage);
    setOpen(true);
  }, []);

  const onDelete = useCallback((storage: Storage) => {
    setDeleting(storage);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/v1/product-config/storageType/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      await fetchStorages();
      toast.success("Storage deleted successfully");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error: unknown) {
      console.error("Error deleting storage:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Cannot delete storage as it is being used in products");
        } else {
          toast.error("Failed to delete storage");
        }
      } else {
        toast.error("Failed to delete storage");
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, token, userRole, fetchStorages]);

  const filteredStorages = useMemo(() => {
    const bySearch = (s: Storage) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return s.ram.toLowerCase().includes(searchLower) || 
             s.rom.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (s: Storage) => {
      if (!statusFilter) return true;
      return s.status === statusFilter;
    };
    
    const result = storages.filter((s) => bySearch(s) && byStatus(s));
    return result.map((s, idx) => ({ ...s, id: idx + 1 }));
  }, [storages, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <StoragesHeader onAddClick={() => { setEditing(null); setOpen(true); }} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <StoragesFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <StoragesTable
              storages={filteredStorages}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Dialogs */}
        <StorageModal 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={onSubmit} 
          editing={editing ? { ram: editing.ram, rom: editing.rom, status: editing.status.toLowerCase() } : null} 
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          storage={deleting}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
