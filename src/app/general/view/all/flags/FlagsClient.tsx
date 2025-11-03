"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getFlagColumns, type Flag } from "@/components/TableHelper/flag_columns";
import FlagModal from "./FlagModal";
import FlagsHeader from "./FlagsHeader";
import FlagsFilters from "./FlagsFilters";
import FeaturedConfirmDialog from "./FeaturedConfirmDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

type ApiFlag = {
  _id: string;
  productFlagId: string;
  name: string;
  icon: string;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
};

export default function FlagsClient() {
  const { data: session } = useSession();
  type AugmentedSession = { accessToken?: string; user?: { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [flags, setFlags] = useState<Flag[]>([]);
  // removed unused loading state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Flag | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [featuredFlag, setFeaturedFlag] = useState<Flag | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState<Flag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFlags = useCallback(async () => {
    try {
      // Cache-buster to avoid any intermediate caching returning stale data
      const response = await axios.get("/api/v1/product-config/productFlag", { params: { _ts: Date.now() } });
      const apiFlags: ApiFlag[] = response.data.data;
      
      const mappedFlags: Flag[] = apiFlags.map((f, index) => ({
        _id: f._id,
        id: index + 1,
        productFlagId: f.productFlagId,
        name: f.name,
        icon: f.icon || '', // Ensure icon is always a string
        status: f.status === "active" ? "Active" : "Inactive",
        featured: f.featured ? "Featured" : "Not Featured",
        created_at: f.createdAt,
      }));
      
      setFlags(mappedFlags);
    } catch (error) {
      console.error("Error fetching flags:", error);
      toast.error("Failed to fetch flags");
    } finally {
      // no-op
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const deriveProductFlagId = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const onSubmit = async (data: { name: string; icon: string; status?: string }) => {
    try {
      setSaveLoading(true);
      const candidateId = deriveProductFlagId(data.name);

      // Client-side duplicate check against already loaded flags
      const isDuplicate = flags.some((f) => f.productFlagId.toLowerCase() === candidateId);
      if (!editing && isDuplicate) {
        toast.error("A flag with the same ID already exists. Try a different name.");
        return;
      }

      const payload: Record<string, unknown> = {
        productFlagId: candidateId,
        name: data.name,
        ...(editing && { status: data.status }),
      };
      // Always include icon field, even if empty, to ensure it's saved
      payload.icon = data.icon && data.icon.trim() !== "" ? data.icon : '';

      if (editing) {
        // Optimistic update for status and name/icon
        const optimistic: Flag[] = flags.map((f) => {
          if (f._id !== editing._id) return f;
          const nextStatus: "Active" | "Inactive" | undefined = data.status
            ? (data.status === "active" || data.status === "Active" ? "Active" : "Inactive")
            : undefined;
          return {
            ...f,
            name: data.name,
            icon: data.icon || f.icon,
            ...(nextStatus ? { status: nextStatus } : {}),
          } as Flag;
        });
        setFlags(optimistic);

        await axios.patch(`/api/v1/product-config/productFlag/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          },
        });
        toast.success("Flag updated successfully!");
      } else {
        const createRes = await axios.post("/api/v1/product-config/productFlag", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          },
        });
        const created: ApiFlag | undefined = createRes?.data?.data;
        if (created) {
          const newFlag: Flag = {
            _id: created._id,
            id: (flags[0]?.id ?? 0) + 1,
            productFlagId: created.productFlagId,
            name: created.name,
            icon: created.icon,
            status: created.status === "active" ? "Active" : "Inactive",
            featured: created.featured ? "Featured" : "Not Featured",
            created_at: created.createdAt,
          };
          setFlags((prev) => [newFlag, ...prev]);
        }
        toast.success("Flag created successfully!");
      }

      setOpen(false);
      setEditing(null);
      // No need to refetch after optimistic update; background refresh optional
    } catch (error: unknown) {
      console.error("Error saving flag:", error);
      // Attempt to surface server message and duplicate errors
      let serverMessage: string | undefined;
      let responseStatus: number | undefined;
      let genericMessage: string | undefined;

      if (axios.isAxiosError(error)) {
        responseStatus = error.response?.status;
        const data = error.response?.data as { message?: string; error?: string } | undefined;
        serverMessage = data?.message || data?.error;
        genericMessage = error.message;
      } else if (error instanceof Error) {
        genericMessage = error.message;
      }

      const isDuplicateKey =
        responseStatus === 409 ||
        (typeof serverMessage === "string" && /duplicate key/i.test(serverMessage)) ||
        (typeof genericMessage === "string" && /E11000 duplicate key/i.test(genericMessage));

      if (isDuplicateKey) {
        toast.error("Flag already exists with this ID or name.");
      } else if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error(`Failed to ${editing ? "update" : "create"} flag`);
      }
      // Optional: rollback for edit case if needed (kept minimal to avoid flicker)
    }
    finally {
      setSaveLoading(false);
    }
  };

  const onEdit = useCallback((flag: Flag) => {
    setEditing(flag);
    setOpen(true);
  }, []);

  const onDelete = useCallback((flag: Flag) => {
    setDeleteFlag(flag);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteFlag) return;

    // Optimistic UI: remove immediately
    const toDeleteId = deleteFlag._id;
    const previousFlags = flags;
    setDeleteLoading(true);
    setFlags((prev) => prev.filter((f) => f._id !== toDeleteId).map((f, idx) => ({ ...f, id: idx + 1 })));

    try {
      await axios.delete(`/api/v1/product-config/productFlag/${toDeleteId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Flag deleted successfully!");
      setDeleteModalOpen(false);
      setDeleteFlag(null);
    } catch (error) {
      console.error("Error deleting flag:", error);
      // Rollback on failure
      setFlags(previousFlags);
      toast.error("Failed to delete flag");
    } finally {
      setDeleteLoading(false);
    }
  };

  const onToggleFeatured = useCallback((flag: Flag) => {
    setFeaturedFlag(flag);
    setFeaturedModalOpen(true);
  }, []);

  const handleFeaturedToggle = async () => {
    if (!featuredFlag) return;

    // Optimistic UI toggle
    const toUpdateId = featuredFlag._id;
    const previousFlags = flags;
    const newFeaturedBool = featuredFlag.featured !== "Featured";
    setFeaturedLoading(true);
    setFlags((prev) => prev.map((f) => f._id === toUpdateId ? { ...f, featured: newFeaturedBool ? "Featured" : "Not Featured" } : f));

    try {
      await axios.patch(`/api/v1/product-config/productFlag/${toUpdateId}`, {
        featured: newFeaturedBool,
      }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
          "Content-Type": "application/json",
        }
      });
      toast.success(`Flag ${newFeaturedBool ? "featured" : "unfeatured"} successfully`);
      setFeaturedModalOpen(false);
      setFeaturedFlag(null);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      // Rollback
      setFlags(previousFlags);
      toast.error("Failed to update featured status");
    } finally {
      setFeaturedLoading(false);
    }
  };

  const columns = useMemo(() => getFlagColumns({ onEdit, onDelete, onToggleFeatured }), [onEdit, onDelete, onToggleFeatured]);

  const filteredFlags = useMemo(() => {
    const bySearch = (f: Flag) => {
      if (!searchText) return true;
      const s = searchText.toLowerCase();
      return f.name.toLowerCase().includes(s) || f.productFlagId.toLowerCase().includes(s);
    };
    const byStatus = (f: Flag) => {
      if (!statusFilter) return true;
      return f.status === statusFilter;
    };
    const result = flags.filter((f) => bySearch(f) && byStatus(f));
    return result.map((f, idx) => ({ ...f, id: idx + 1 }));
  }, [flags, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <div>
          <FlagsHeader onAddClick={() => setOpen(true)} />
        </div>

        <div>
          <FlagsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <DataTable columns={columns} data={filteredFlags} />
          </div>
        </div>

        <FlagModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={onSubmit}
          editing={editing ? {
            name: editing.name,
            icon: editing.icon,
            status: editing.status.toLowerCase(),
          } : null}
          loading={saveLoading}
        />

        <FeaturedConfirmDialog
          open={featuredModalOpen}
          onOpenChange={setFeaturedModalOpen}
          isCurrentlyFeatured={featuredFlag?.featured === "Featured"}
        onConfirm={handleFeaturedToggle}
        loading={featuredLoading}
        />

      <DeleteConfirmDialog
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          flagName={deleteFlag?.name}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        />
      </div>
    </div>
  );
}
