"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getSubCategoryColumns, type SubCategory } from "@/components/TableHelper/subcategory_columns";
import SubcategoriesHeader from "./SubcategoriesHeader";
import SubcategoriesFilters from "./SubcategoriesFilters";
import DeleteSubcategoryDialog from "./DeleteSubcategoryDialog";
import SubCategoryEditModal from "./SubCategoryEditModal";

type ApiSubCategory = {
  _id: string;
  subCategoryId: string;
  name: string;
  category?: { _id: string; name: string } | string;
  subCategoryIcon?: string;
  subCategoryBanner?: string;
  isFeatured: boolean;
  isNavbar: boolean;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function SubCategoriesClient() {
  const [rows, setRows] = useState<SubCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive" | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<SubCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomSubCategory", { params: { _ts: Date.now() } });
      const items: ApiSubCategory[] = res.data.data || [];
      const mapped: SubCategory[] = items.map((it, index) => ({
        _id: it._id,
        subCategoryId: it.subCategoryId,
        id: index + 1,
        category: typeof it.category === 'object' && it.category ? (it.category as any).name : (it.category || ''),
        // Preserve category id for edit modal to avoid invalid ObjectId errors
        categoryId: typeof it.category === 'object' && it.category ? (it.category as any)._id : (it.category || ''),
        name: it.name,
        subCategoryIcon: it.subCategoryIcon,
        subCategoryBanner: it.subCategoryBanner,
        slug: it.slug,
        isFeatured: it.isFeatured,
        isNavbar: it.isNavbar,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch subcategories");
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const onDelete = useCallback((row: SubCategory) => {
    setDeleting(row);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleting?._id) return;
    const id = deleting._id;
    const prev = rows;
    setDeleteLoading(true);
    setRows((r) => r.filter((x) => x._id !== id).map((x, idx) => ({ ...x, id: idx + 1 })));
    try {
      await axios.delete(`/api/v1/ecommerce-category/ecomSubCategory/${id}`);
      toast.success("Subcategory deleted successfully!");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (e: unknown) {
      setRows(prev);
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete subcategory');
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, rows]);

  const columns = useMemo(() => getSubCategoryColumns({ onEdit: (row) => { setEditing(row); setEditOpen(true); }, onDelete }), [onDelete]);

  const filtered = useMemo(() => {
    const byStatus = (r: SubCategory) => statusFilter === "all" || r.status === statusFilter;
    const bySearch = (r: SubCategory) => !searchText || r.name.toLowerCase().includes(searchText.toLowerCase()) || (r.slug || "").toLowerCase().includes(searchText.toLowerCase());
    return rows.filter(r => byStatus(r) && bySearch(r));
  }, [rows, statusFilter, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <SubcategoriesHeader />
        <SubcategoriesFilters
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>

        <SubCategoryEditModal
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
              isFeatured: u.isFeatured,
              isNavbar: u.isNavbar,
              category: u.categoryName || r.category,
            } : r));
          }}
        />

        <DeleteSubcategoryDialog
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


