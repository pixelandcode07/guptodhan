"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { type DeviceCondition } from "@/components/TableHelper/device_condition_columns";
import DeviceConditionsHeader from "./DeviceConditionsHeader";
import DeviceConditionsTable from "./DeviceConditionsTable";
import DeviceConditionModal from "./DeviceConditionModal";
import { useSession } from "next-auth/react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

async function fetchDeviceConditions(): Promise<DeviceCondition[]> {
  const { data } = await api.get("/product-config/deviceCondition");
  const items = (data?.data ?? []) as Array<{ _id: string; deviceCondition: string; createdAt: string }>;
  return items.map((item, index) => ({
    _id: item._id,
    id: index + 1,
    name: item.deviceCondition,
    // Backend model has no explicit status; leaving undefined shows "-" in table
    created_at: new Date(item.createdAt).toLocaleString(),
  }));
}

export default function DeviceConditionsClient() {
  const [conditions, setConditions] = useState<DeviceCondition[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceCondition | null>(null);
  const [searchText, setSearchText] = useState("");
  // const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const { data: session } = useSession();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<DeviceCondition | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchDeviceConditions();
        setConditions(list);
      } catch (error) {
        console.error("Failed to fetch device conditions", error);
        toast.error("Failed to load device conditions");
      }
    })();
  }, []);

  const onSubmit = async (data: { name: string }) => {
    try {
      const s = session as { accessToken?: string; user?: { role?: string } } | null;
      const token = s?.accessToken;
      const userRole = s?.user?.role;

      if (editing && editing._id) {
        await api.patch(`/product-config/deviceCondition/${editing._id}`, {
          deviceCondition: data.name,
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          }
        });
        toast.success("Device condition updated successfully!");
      } else {
        await api.post(`/product-config/deviceCondition`, {
          deviceCondition: data.name,
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          }
        });
        toast.success("Device condition created successfully!");
      }

      const list = await fetchDeviceConditions();
      setConditions(list);
      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error saving device condition:", error);
      toast.error(`Failed to ${editing ? 'update' : 'create'} device condition`);
    }
  };

  const onEdit = useCallback((condition: DeviceCondition) => {
    setEditing(condition);
    setOpen(true);
  }, []);

  const onDelete = useCallback((condition: DeviceCondition) => {
    setDeleting(condition);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting || !deleting._id) return;
    try {
      setDeleteLoading(true);
      const s = session as { accessToken?: string; user?: { role?: string } } | null;
      const token = s?.accessToken;
      const userRole = s?.user?.role;
      await api.delete(`/product-config/deviceCondition/${deleting._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        }
      });
      setConditions(prev => prev.filter(c => c._id !== deleting._id));
      setDeleteOpen(false);
      setDeleting(null);
      toast.success("Device condition deleted successfully!");
    } catch (error) {
      console.error("Failed to delete device condition", error);
      toast.error("Failed to delete device condition");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, session]);

  const filteredConditions = useMemo(() => {
    const bySearch = (c: DeviceCondition) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return c.name.toLowerCase().includes(searchLower);
    };
    const result = conditions.filter((c) => bySearch(c));
    return result.map((c, idx) => ({ ...c, id: idx + 1 }));
  }, [conditions, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <DeviceConditionsHeader onAddClick={() => { setEditing(null); setOpen(true); }} />
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
                  Search by Condition Name
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by condition name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <DeviceConditionsTable
              conditions={filteredConditions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Modal */}
        <DeviceConditionModal 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={onSubmit} 
          editing={editing ? { name: editing.name } : null} 
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemName={deleting?.name}
          loading={deleteLoading}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
