"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getChildCategoryColumns, type ChildCategory } from "@/components/TableHelper/childcategory_columns";
import ChildCategoriesHeader from "./ChildCategoriesHeader";
import ChildCategoriesFilters from "./ChildCategoriesFilters";
import DeleteChildCategoryDialog from "./DeleteChildCategoryDialog";
import ChildCategoryEditModal from "./ChildCategoryEditModal";

type ApiChildCategory = {
  _id: string;
  childCategoryId: string;
  name: string;
  category?: { _id: string; name: string } | string;
  subCategory?: { _id: string; name: string } | string;
  icon?: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ChildCategoriesClient() {
  const [rows, setRows] = useState<ChildCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive" | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<ChildCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ChildCategory | null>(null);

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomChildCategory", { params: { _ts: Date.now() } });
      const items: ApiChildCategory[] = res.data.data || [];
      const mapped: ChildCategory[] = items.map((it, index) => ({
        _id: it._id,
        childCategoryId: it.childCategoryId,
        id: index + 1,
        category: typeof it.category === 'object' && it.category ? it.category.name : (it.category || ''),
        subCategory: typeof it.subCategory === 'object' && it.subCategory ? it.subCategory.name : (it.subCategory || ''),
        // Preserve IDs for edit modal
        categoryId: typeof it.category === 'object' && it.category ? (it.category as any)._id : (it.category || ''),
        subCategoryId: typeof it.subCategory === 'object' && it.subCategory ? (it.subCategory as any)._id : (it.subCategory || ''),
        name: it.name,
        icon: it.icon,
        slug: it.slug,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch child categories");
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const confirmDelete = useCallback(async () => {
    if (!deleting?._id) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/v1/ecommerce-category/ecomChildCategory/${deleting._id}`);
      // Optimistic update - remove from UI immediately
      setRows(prev => prev.filter(r => r._id !== deleting._id).map((r, idx) => ({ ...r, id: idx + 1 })));
      toast.success("Child category deleted successfully!");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete child category');
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting]);

  const onDelete = useCallback((row: ChildCategory) => {
    setDeleting(row);
    setDeleteOpen(true);
  }, []);

  const onEdit = useCallback((row: ChildCategory) => {
    setEditing(row);
    setEditOpen(true);
  }, []);

  const columns = useMemo(() => getChildCategoryColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  const filtered = useMemo(() => {
    const byStatus = (r: ChildCategory) => {
      if (statusFilter === "all") return true;
      return r.status === statusFilter;
    };

    const bySearch = (r: ChildCategory) => {
      if (!searchText.trim()) return true;
      const search = searchText.toLowerCase();
      return r.name.toLowerCase().includes(search) || 
             r.slug.toLowerCase().includes(search) ||
             r.category.toLowerCase().includes(search) ||
             r.subCategory.toLowerCase().includes(search);
    };

    return rows.filter(r => byStatus(r) && bySearch(r));
  }, [rows, statusFilter, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <ChildCategoriesHeader />
        <ChildCategoriesFilters
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>

        <ChildCategoryEditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={editing}
          onSaved={fetchRows}
          onOptimisticUpdate={(u) => {
            setRows((prev) => prev.map((r) => r._id === u._id ? {
              ...r,
              name: u.name,
              slug: u.slug,
              status: u.status,
              category: u.categoryName || r.category,
              subCategory: u.subCategoryName || r.subCategory,
            } : r));
          }}
        />

        <DeleteChildCategoryDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          name={deleting?.name}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
