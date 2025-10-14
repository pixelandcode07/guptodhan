"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getCategoryColumns, type Category } from "@/components/TableHelper/category_columns";
import { useSession } from "next-auth/react";
import CategoryEditModal from "./CategoryEditModal";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesFilters from "./CategoriesFilters";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

type ApiCategory = {
  _id: string;
  categoryId: string;
  name: string;
  categoryIcon: string;
  categoryBanner?: string;
  isFeatured: boolean;
  isNavbar: boolean;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function CategoriesClient() {
  const { data: session } = useSession();
  const s = session as (undefined | { accessToken?: string; user?: { role?: string } });
  const token = s?.accessToken;
  const userRole = s?.user?.role;
  const [rows, setRows] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive" | "all">("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomCategory", {
        params: { _ts: Date.now() },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      const items: ApiCategory[] = res.data.data || [];
      const mapped: Category[] = items.map((it, index) => ({
        _id: it._id,
        categoryId: it.categoryId,
        id: index + 1,
        name: it.name,
        categoryIcon: it.categoryIcon,
        categoryBanner: it.categoryBanner,
        slug: it.slug,
        isFeatured: it.isFeatured,
        isNavbar: it.isNavbar,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e: unknown) {
      console.error("Error fetching categories:", e);
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch categories";
      toast.error(msg);
    }
  }, [token, userRole]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const onDelete = useCallback((row: Category) => {
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
      await axios.delete(`/api/v1/ecommerce-category/ecomCategory/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Category deleted successfully!");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (e: unknown) {
      setRows(prev);
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  }, [deleting, rows, token, userRole]);

  const columns = useMemo(() => getCategoryColumns({ onEdit: (row) => { setEditing(row); setEditOpen(true); }, onDelete }), [onDelete]);

  const filtered = useMemo(() => {
    const byStatus = (r: Category) => statusFilter === "all" || r.status === statusFilter;
    const bySearch = (r: Category) => !searchText || r.name.toLowerCase().includes(searchText.toLowerCase()) || (r.slug || "").toLowerCase().includes(searchText.toLowerCase());
    return rows.filter(r => byStatus(r) && bySearch(r));
  }, [rows, statusFilter, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <CategoriesHeader />
        <CategoriesFilters
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>

        <CategoryEditModal
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
            } : r));
          }}
        />

        <DeleteCategoryDialog
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


