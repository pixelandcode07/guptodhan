"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { type Unit } from "@/components/TableHelper/unit_columns";
import UnitsHeader from "./UnitsHeader";
import UnitsFilters from "./UnitsFilters";
import UnitsTable from "./UnitsTable";
import UnitModal from "./UnitModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import FancyLoadingPage from "@/app/general/loading";

type Session = {
  user?: {
    role?: string;
  };
  accessToken?: string;
};

type ApiUnit = {
  _id: string;
  productUnitId: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function UnitsClient() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Unit | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/product-config/productUnit");

      const mappedUnits: Unit[] = response.data.data.map((u: ApiUnit, index: number) => ({
        _id: u._id,
        id: index + 1,
        productUnitId: u.productUnitId,
        name: u.name,
        status: u.status === "active" ? "Active" : "Inactive",
        created_at: new Date(u.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      }));

      setUnits(mappedUnits);
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to fetch units");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const resetForm = () => {
    setEditing(null);
    setOpen(false);
  };

  const deriveProductUnitId = (name: string) => {
    return name.trim().toUpperCase().replace(/\s+/g, "_");
  };

  const onSubmit = async (formData: { name: string; status?: string }) => {
    try {
      // Client-side validation for duplicate names
      if (!editing) {
        const existingUnit = units.find(
          (unit) => unit.name.toLowerCase() === formData.name.toLowerCase()
        );
        if (existingUnit) {
          toast.error("A unit with this name already exists");
          return;
        }
      }

      const payload = {
        productUnitId: deriveProductUnitId(formData.name),
        name: formData.name,
        ...(editing && { status: formData.status === "Active" ? "active" : "inactive" }),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productUnit/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Unit updated successfully!");
      } else {
        await axios.post(`/api/v1/product-config/productUnit`, {
          ...payload,
          status: "active",
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Unit created successfully!");
      }

      resetForm();
      await fetchUnits();
    } catch (error) {
      console.error("Error saving unit:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("A unit with this name already exists");
      } else {
        toast.error(editing ? "Failed to update unit" : "Failed to create unit");
      }
      // Don't close modal on error - let user try again
    }
  };

  const onEdit = useCallback((unit: Unit) => {
    setEditing(unit);
    setOpen(true);
  }, []);

  const onDelete = useCallback((unit: Unit) => {
    setDeleting(unit);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/v1/product-config/productUnit/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Unit deleted successfully!");
      await fetchUnits();
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error("Failed to delete unit");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, token, userRole, fetchUnits]);

  const filteredUnits = useMemo(() => {
    const bySearch = (u: Unit) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return u.name.toLowerCase().includes(searchLower) || 
             u.productUnitId.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (u: Unit) => {
      if (!statusFilter) return true;
      return u.status === statusFilter;
    };
    
    const result = units.filter((u) => bySearch(u) && byStatus(u));
    return result.map((u, idx) => ({ ...u, id: idx + 1 }));
  }, [units, searchText, statusFilter]);

  return (
    loading ? (
      <FancyLoadingPage />
    ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <UnitsHeader onAddClick={() => { 
            setEditing(null); 
            setOpen(true); 
            setSearchText(""); 
            setStatusFilter(""); 
          }} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <UnitsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <UnitsTable
              units={filteredUnits}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Modal */}
        <UnitModal
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
          unit={deleting}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
    )
  );
}
