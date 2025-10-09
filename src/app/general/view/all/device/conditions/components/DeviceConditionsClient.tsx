"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { type DeviceCondition } from "@/components/TableHelper/device_condition_columns";
import DeviceConditionsHeader from "./DeviceConditionsHeader";
import DeviceConditionsTable from "./DeviceConditionsTable";
import DeviceConditionModal from "./DeviceConditionModal";

function getData(): DeviceCondition[] {
  return [
    { id: 1, name: "Brand New (Official)", status: "Active", created_at: "2023-06-05 10:34:14 am" },
    { id: 2, name: "Brand New (Unofficial)", status: "Active", created_at: "2023-07-17 03:50:39 am" },
    { id: 3, name: "Used (Few Scratches)", status: "Inactive", created_at: "2023-07-17 03:52:02 am" },
    { id: 4, name: "Used (Fresh Condition)", status: "Active", created_at: "2023-06-05 10:34:27 am" },
    { id: 5, name: "Refurbished", status: "Active", created_at: "2023-06-05 10:34:33 am" },
  ];
}

export default function DeviceConditionsClient() {
  const [conditions, setConditions] = useState<DeviceCondition[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceCondition | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");

  useEffect(() => {
    setConditions(getData());
  }, []);

  const onSubmit = async (data: { name: string; status?: string }) => {
    try {
      if (editing) {
        // Update existing condition
        setConditions(prev => prev.map(condition => 
          condition.id === editing.id 
            ? { ...condition, name: data.name, status: data.status as "Active" | "Inactive" || "Active" }
            : condition
        ));
        toast.success("Device condition updated successfully!");
      } else {
        // Add new condition
        const newCondition: DeviceCondition = {
          id: Math.max(...conditions.map(c => c.id)) + 1,
          name: data.name,
          status: "Active",
          created_at: new Date().toLocaleString(),
        };
        setConditions(prev => [newCondition, ...prev]);
        toast.success("Device condition created successfully!");
      }

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
    setConditions(prev => prev.filter(c => c.id !== condition.id));
    toast.success("Device condition deleted successfully!");
  }, []);

  const filteredConditions = useMemo(() => {
    const bySearch = (c: DeviceCondition) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return c.name.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (c: DeviceCondition) => {
      if (!statusFilter) return true;
      return c.status === statusFilter;
    };
    
    const result = conditions.filter((c) => bySearch(c) && byStatus(c));
    return result.map((c, idx) => ({ ...c, id: idx + 1 }));
  }, [conditions, searchText, statusFilter]);

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
          editing={editing ? { name: editing.name, status: editing.status || "Active" } : null} 
        />
      </div>
    </div>
  );
}
