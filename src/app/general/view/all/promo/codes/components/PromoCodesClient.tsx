"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { getPromoCodeColumns, type PromoCode } from "@/components/TableHelper/promo_codes_columns";
import PromoCodeHeader from "./PromoCodeHeader";
import PromoCodeFilters from "./PromoCodeFilters";
import DeletePromoCodeDialog from "./DeletePromoCodeDialog";
import PromoCodeEditModal from "./PromoCodeEditModal";
import { toast } from "sonner";

export default function PromoCodesClient({ initialRows }: { initialRows: any[] }) {
  const [rows, setRows] = useState<PromoCode[]>(initialRows || []);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive" | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<PromoCode | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  const onDelete = useCallback((row: PromoCode) => {
    setDeleting(row);
    setDeleteOpen(true);
  }, []);

  const onEdit = useCallback((row: PromoCode) => {
    setEditing(row);
    setEditOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleting?._id) return;
    
    setDeleteLoading(true);
    const prev = rows;
    try {
      // Optimistic update
      setRows(prev => prev.filter(r => r._id !== deleting._id).map((r, idx) => ({ ...r, id: idx + 1 })));
      
      const res = await fetch(`/api/v1/promo-code/${deleting._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to delete promo code');
      }
      
      toast.success("Promo code deleted successfully!");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (e: unknown) {
      setRows(prev);
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to delete promo code');
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, rows]);

  const columns = useMemo(() => getPromoCodeColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  const filtered = useMemo(() => {
    const byStatus = (r: PromoCode) => {
      if (statusFilter === "all") return true;
      return r.status === statusFilter;
    };

    const bySearch = (r: PromoCode) => {
      if (!searchText.trim()) return true;
      const search = searchText.toLowerCase();
      return r.title.toLowerCase().includes(search) || 
             r.code.toLowerCase().includes(search) ||
             (r.shortDescription || "").toLowerCase().includes(search);
    };

    return rows.filter(r => byStatus(r) && bySearch(r));
  }, [rows, statusFilter, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <PromoCodeHeader />
        <PromoCodeFilters
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>

        <DeletePromoCodeDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />

        <PromoCodeEditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={editing}
          onSaved={() => {}}
          onOptimisticUpdate={(u) => {
            setRows((prev) => prev.map((r) => r._id === u._id ? {
              ...r,
              title: u.title,
              effective_date: u.effective_date,
              expiry_date: u.expiry_date,
              type: u.type,
              value: u.value,
              min_spend: u.min_spend,
              code: u.code,
              status: u.status,
              icon: u.icon,
              shortDescription: u.shortDescription,
            } : r));
          }}
        />
      </div>
    </div>
  );
}


