"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { type Size } from "@/components/TableHelper/size_columns";
import SizesHeader from "./SizesHeader";
import SizesFilters from "./SizesFilters";
import SizesTable from "./SizesTable";
import SizeModal from "./SizeModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";


type ApiSize = {
  _id: string;
  sizeId: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function SizesClient() {
  const { data: session } = useSession();
  type AugmentedSession = { accessToken?: string; user?: { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [sizes, setSizes] = useState<Size[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Size | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Size | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSizes = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/product-config/productSize", { params: { _ts: Date.now() } });
      const apiSizes: ApiSize[] = response.data.data;

      const mapped: Size[] = apiSizes.map((f, index) => ({
        _id: f._id,
        sizeId: f.sizeId,
        id: index + 1,
        name: f.name,
        status: f.status === "active" ? "Active" : "Inactive",
        created_at: f.createdAt,
      }));
      setSizes(mapped);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to fetch sizes");
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const deriveSizeId = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const onSubmit = async (data: { name: string; status?: string }) => {
    try {
      const candidateId = deriveSizeId(data.name);

      const payload: Record<string, unknown> = {
        sizeId: candidateId,
        name: data.name,
        ...(editing && data.status ? { status: data.status } : {}),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productSize/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Size updated successfully!");
        setSizes(prev => prev.map(s => s._id === editing._id ? {
          ...s,
          name: (payload.name as string) || s.name,
          status: (payload.status === 'inactive') ? 'Inactive' : 'Active',
        } : s));
      } else {
        const res = await axios.post("/api/v1/product-config/productSize", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        const created: ApiSize | undefined = res?.data?.data;
        if (created) {
          const newRow: Size = {
            _id: created._id,
            sizeId: created.sizeId,
            id: (sizes[0]?.id ?? 0) + 1,
            name: created.name,
            status: created.status === "inactive" ? "Inactive" : "Active",
            created_at: created.createdAt || new Date().toISOString(),
          };
          setSizes((prev) => [newRow, ...prev]);
        }
        toast.success("Size created successfully!");
      }

      setOpen(false);
      setEditing(null);
      await fetchSizes();
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error(`Failed to ${editing ? "update" : "create"} size`);
    }
  };

  const filtered = useMemo(() => {
    return sizes.filter((row) => {
      const matchesSearch = !searchText || row.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sizes, searchText, statusFilter]);

  const onDelete = useCallback((row: Size) => {
    setDeleting(row);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    
    setDeleteLoading(true);
    try {
      if (!deleting._id) return;
      await axios.delete(`/api/v1/product-config/productSize/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      setSizes(prev => prev.filter(s => s._id !== deleting._id));
      toast.success("Size deleted successfully!");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error: unknown) {
      console.error("Error deleting size:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Cannot delete size as it is being used in products");
        } else {
          toast.error("Failed to delete size");
        }
      } else {
        toast.error("Failed to delete size");
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, token, userRole]);

  const onEdit = useCallback((row: Size) => {
    setEditing(row);
    setOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditing(null);
    setOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <SizesHeader onAddNew={handleAddNew} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <SizesFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <SizesTable
            sizes={filtered}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        {/* Modals */}
        <SizeModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={onSubmit}
          editing={editing ? { name: editing.name, status: editing.status.toLowerCase() } : null}
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          size={deleting}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}


