"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { type Color } from "@/components/TableHelper/color_columns";
import ColorsHeader from "./ColorsHeader";
import ColorsFilters from "./ColorsFilters";
import ColorsTable from "./ColorsTable";
import ColorModal from "./color-modal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

type Session = {
  user?: {
    role?: string;
  };
  accessToken?: string;
};

type ApiColor = {
  _id: string;
  productColorId: string;
  color: string;
  colorName: string;
  colorCode: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ColorsClient() {
  const [colors, setColors] = useState<Color[]>([]);
  const [, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Color | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Color | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/product-config/productColor", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      const mappedColors: Color[] = response.data.data.map((c: ApiColor, index: number) => ({
        _id: c._id,
        id: index + 1,
        productColorId: c.productColorId,
        name: c.colorName,
        code: c.colorCode,
        status: c.status === "active" ? "Active" : "Inactive",
        created_at: new Date(c.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      }));

      setColors(mappedColors);
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Failed to fetch colors");
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const resetForm = () => {
    setEditing(null);
    setOpen(false);
  };

  const deriveProductColorId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const onSubmit = async (formData: { name: string; code: string; status?: string }) => {
    try {
      const payload = {
        productColorId: deriveProductColorId(formData.name),
        color: formData.name,
        colorName: formData.name,
        colorCode: formData.code,
        ...(editing && { status: formData.status === "Active" ? "active" : "inactive" }),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productColor/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Color updated successfully!");
      } else {
        await axios.post(`/api/v1/product-config/productColor`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Color created successfully!");
      }

      resetForm();
      await fetchColors();
    } catch (error) {
      console.error("Error saving color:", error);
      toast.error(editing ? "Failed to update color" : "Failed to create color");
    }
  };

  const onEdit = useCallback((color: Color) => {
    setEditing(color);
    setOpen(true);
  }, []);

  const onDelete = useCallback((color: Color) => {
    setDeleting(color);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/v1/product-config/productColor/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Color deleted successfully!");
      await fetchColors();
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Failed to delete color");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, token, userRole, fetchColors]);

  const filteredColors = useMemo(() => {
    const bySearch = (c: Color) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return c.name.toLowerCase().includes(searchLower) || 
             c.code.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (c: Color) => {
      if (!statusFilter) return true;
      return c.status === statusFilter;
    };
    
    const result = colors.filter((c) => bySearch(c) && byStatus(c));
    return result.map((c, idx) => ({ ...c, id: idx + 1 }));
  }, [colors, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <ColorsHeader onAddClick={() => { setEditing(null); setOpen(true); }} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <ColorsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <ColorsTable
              colors={filteredColors}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Modal */}
        <ColorModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={onSubmit}
          editing={editing}
          onClose={resetForm}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          color={deleting}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
