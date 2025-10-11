"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { type Sim } from "@/components/TableHelper/sim_columns";
import SimsHeader from "./SimsHeader";
import SimsFilters from "./SimsFilters";
import SimsTable from "./SimsTable";
import SimModal from "./SimModal";

function getData(): Sim[] {
  return [
    { id: 1, name: "Dual e-SIM", status: "Active", created_at: "2023-06-05 10:25:43 am" },
    { id: 2, name: "Dual SIM", status: "Active", created_at: "2023-06-05 10:25:36 am" },
    { id: 3, name: "Single e-SIM", status: "Inactive", created_at: "2023-06-05 10:25:30 am" },
    { id: 4, name: "Single SIM", status: "Active", created_at: "2023-06-05 10:25:24 am" },
  ];
}

export default function SimsClient() {
  const [sims, setSims] = useState<Sim[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sim | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");

  useEffect(() => {
    setSims(getData());
  }, []);

  const onSubmit = async (data: { name: string; status?: string }) => {
    try {
      if (editing) {
        // Update existing SIM
        setSims(prev => prev.map(sim => 
          sim.id === editing.id 
            ? { ...sim, name: data.name, status: data.status as "Active" | "Inactive" || "Active" }
            : sim
        ));
        toast.success("SIM type updated successfully!");
      } else {
        // Add new SIM
        const newSim: Sim = {
          id: Math.max(...sims.map(s => s.id)) + 1,
          name: data.name,
          status: "Active",
          created_at: new Date().toLocaleString(),
        };
        setSims(prev => [newSim, ...prev]);
        toast.success("SIM type created successfully!");
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error saving SIM:", error);
      toast.error(`Failed to ${editing ? 'update' : 'create'} SIM type`);
    }
  };

  const onEdit = useCallback((sim: Sim) => {
    setEditing(sim);
    setOpen(true);
  }, []);

  const onDelete = useCallback((sim: Sim) => {
    setSims(prev => prev.filter(s => s.id !== sim.id));
    toast.success("SIM type deleted successfully!");
  }, []);

  const filteredSims = useMemo(() => {
    const bySearch = (s: Sim) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return s.name.toLowerCase().includes(searchLower);
    };
    
    const byStatus = (s: Sim) => {
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

        {/* Modal */}
        <SimModal 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={onSubmit} 
          editing={editing ? { name: editing.name, status: editing.status || "Active" } : null} 
        />
      </div>
    </div>
  );
}
