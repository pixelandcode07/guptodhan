"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { Model } from "@/components/TableHelper/model_columns";
import ModelsHeader from "./components/ModelsHeader";
import ModelsFilters from "./components/ModelsFilters";
import ModelsTable from "./components/ModelsTable";
import ModelEditDialog from "./components/ModelEditDialog";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

type ApiModel = {
  _id: string;
  modelFormId: string;
  brand: string;
  brandName: string;
  modelName: string;
  modelCode: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ModelsClient() {
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } }
  const s = session as AugmentedSession | null
  const token = s?.accessToken
  const userRole = s?.user?.role

  const [models, setModels] = useState<Model[]>([]);
  const [, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Model | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/product-config/modelName");
      const apiModels: ApiModel[] = data?.data || [];
      const mapped: Model[] = apiModels.map((m, index) => ({
        _id: m._id,
        id: index + 1,
        brand: m.brandName || "Unknown",
        modelName: m.modelName,
        code: m.modelCode,
        slug: m.modelFormId,
        status: m.status === "active" ? "Active" : "Inactive",
        created_at: new Date(m.createdAt).toLocaleString(),
      }));
      setModels(mapped);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const onEdit = useCallback((model: Model) => {
    setEditing(model);
    setEditOpen(true);
  }, []);

  const onDelete = useCallback((model: Model) => {
    setDeleting(model);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/v1/product-config/modelName/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      await fetchModels();
      toast.success("Model deleted successfully");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error: unknown) {
      console.error("Error deleting model:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Cannot delete model as it is being used in products");
        } else {
          toast.error("Failed to delete model");
        }
      } else {
        toast.error("Failed to delete model");
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, token, userRole, fetchModels]);

  const filteredModels = useMemo(() => {
    const bySearch = (m: Model) =>
      !searchText || 
      m.modelName.toLowerCase().includes(searchText.toLowerCase()) || 
      m.brand.toLowerCase().includes(searchText.toLowerCase());
    
    const byStatus = (m: Model) =>
      !statusFilter || m.status === statusFilter;
    
    const result = models.filter((m) => bySearch(m) && byStatus(m));
    return result.map((m, idx) => ({ ...m, id: idx + 1 }));
  }, [models, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <ModelsHeader />
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <ModelsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ModelsTable
            models={filteredModels}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        {/* Dialogs */}
        <ModelEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          editing={editing}
          onSave={fetchModels}
          session={session}
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          model={deleting}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
