"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { type Warranty } from "@/components/TableHelper/warranty_columns";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import WarrantiesHeader from "./WarrantiesHeader";
import WarrantiesTable from "./WarrantiesTable";
import WarrantyModal from "./WarrantyModal";
import DeleteWarrantyDialog from "./DeleteWarrantyDialog";

export default function WarrantiesClient() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warranty | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [warrantyToDelete, setWarrantyToDelete] = useState<Warranty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchWarranties = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/product-config/warranty", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      type ApiWarranty = {
        _id: string;
        warrantyName: string;
        status: "active" | "inactive";
        createdAt?: string;
      };
      const items: ApiWarranty[] = Array.isArray(data?.data) ? data.data : [];
      const mapped: Warranty[] = items.map((w: ApiWarranty, idx: number) => ({
        _id: w._id,
        id: idx + 1,
        name: w.warrantyName ?? "",
        status: (w.status === "active" ? "Active" : "Inactive") as "Active" | "Inactive",
        created_at: w.createdAt ? new Date(w.createdAt).toLocaleString() : "",
      }));
      setWarranties(mapped);
    } catch {
      toast.error("Failed to fetch warranties");
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  const onSubmit = async (data: { name: string; status?: string }) => {
    try {
      if (editing) {
        // Update existing warranty via API
        await axios.patch(`/api/v1/product-config/warranty/${editing._id}`, {
          warrantyName: data.name,
          status: data.status === "Inactive" ? "inactive" : "active",
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          }
        });
        await fetchWarranties();
        toast.success("Warranty type updated successfully!");
      } else {
        // Create new warranty via API
        await axios.post(`/api/v1/product-config/warranty`, {
          warrantyName: data.name,
          status: "active",
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          }
        });
        await fetchWarranties();
        toast.success("Warranty type created successfully!");
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error saving warranty:", error);
      toast.error(`Failed to ${editing ? 'update' : 'create'} warranty type`);
    }
  };

  const onEdit = useCallback((warranty: Warranty) => {
    setEditing(warranty);
    setOpen(true);
  }, []);

  const onDelete = useCallback((warranty: Warranty) => {
    setWarrantyToDelete(warranty);
    setDeleteOpen(true);
  }, []);

  const filteredWarranties = useMemo(() => {
    const bySearch = (w: Warranty) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return w.name.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (w: Warranty) => {
      if (!statusFilter) return true;
      return w.status === statusFilter;
    };
    
    const result = warranties.filter((w) => bySearch(w) && byStatus(w));
    return result.map((w, idx) => ({ ...w, id: idx + 1 }));
  }, [warranties, searchText, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <WarrantiesHeader onAddClick={() => { setEditing(null); setOpen(true); }} />
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Search by Warranty Name
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by warranty name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors bg-white h-10 sm:h-auto"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <WarrantiesTable
              warranties={filteredWarranties}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Modal */}
        <WarrantyModal 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={onSubmit} 
          editing={editing ? { name: editing.name, status: editing.status || "Active" } : null} 
        />

        <DeleteWarrantyDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (!open) {
              setWarrantyToDelete(null);
              setIsDeleting(false);
            }
            setDeleteOpen(open);
          }}
          itemName={warrantyToDelete?.name}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!warrantyToDelete?._id) return;
            setIsDeleting(true);
            try {
              await axios.delete(`/api/v1/product-config/warranty/${warrantyToDelete._id}`, {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  ...(userRole ? { "x-user-role": userRole } : {}),
                }
              });
              toast.success("Warranty type deleted successfully!");
              setDeleteOpen(false);
              setWarrantyToDelete(null);
              await fetchWarranties();
            } catch {
              toast.error("Failed to delete warranty type");
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      </div>
    </div>
  );
}
