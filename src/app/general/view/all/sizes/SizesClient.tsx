"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/TableHelper/data-table";
import { getSizeColumns, type Size } from "@/components/TableHelper/size_columns";
import SizeModal from "./SizeModal";
import Link from "next/link";
import { Move } from "lucide-react";


type ApiSize = {
  _id: string;
  sizeId: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function SizesClient() {
  const { data: session } = useSession();
  type AugmentedSession = { accessToken?: string; user?: { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [sizes, setSizes] = useState<Size[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Size | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSizes = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/product-config/productSize", { params: { _ts: Date.now() } });
      const apiSizes: ApiSize[] = response.data.data;

      const mapped: Size[] = apiSizes.map((f, index) => ({
        _id: f._id,
        sizeId: f.sizeId,
        id: index + 1,
        name: f.name,
        status: f.status === "active" ? "Active" : "Inactive",
        created_at: f.createdAt,
      }));
      setSizes(mapped);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to fetch sizes");
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const deriveSizeId = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const onSubmit = async (data: { name: string; status?: string }) => {
    try {
      const candidateId = deriveSizeId(data.name);

      const payload: Record<string, unknown> = {
        sizeId: candidateId,
        name: data.name,
        ...(editing && data.status ? { status: data.status } : {}),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productSize/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Size updated successfully!");
        setSizes(prev => prev.map(s => s._id === editing._id ? {
          ...s,
          name: (payload.name as string) || s.name,
          status: (payload.status === 'inactive') ? 'Inactive' : 'Active',
        } : s));
      } else {
        const res = await axios.post("/api/v1/product-config/productSize", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        const created: ApiSize | undefined = res?.data?.data;
        if (created) {
          const newRow: Size = {
            _id: created._id,
            sizeId: created.sizeId,
            id: (sizes[0]?.id ?? 0) + 1,
            name: created.name,
            status: created.status === "inactive" ? "Inactive" : "Active",
            created_at: created.createdAt || new Date().toISOString(),
          };
          setSizes((prev) => [newRow, ...prev]);
        }
        toast.success("Size created successfully!");
      }

      setOpen(false);
      setEditing(null);
      await fetchSizes();
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error(`Failed to ${editing ? "update" : "create"} size`);
    }
  };

  const filtered = useMemo(() => {
    return sizes.filter((row) => {
      const matchesStatus = statusFilter === "all" || row.status.toLowerCase() === statusFilter;
      return matchesStatus;
    });
  }, [sizes, statusFilter]);

  const onDelete = useCallback(async (row: Size) => {
    try {
      if (!row._id) return;
      await axios.delete(`/api/v1/product-config/productSize/${row._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      setSizes(prev => prev.filter(s => s._id !== row._id));
      toast.success("Size deleted successfully!");
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Failed to delete size");
    }
  }, [token, userRole]);

  const onEdit = useCallback((row: Size) => {
    setEditing(row);
    setOpen(true);
  }, []);

  const columns = useMemo(() => getSizeColumns({ onDelete, onEdit }), [onDelete, onEdit]);

  return (
    <div className="m-5 p-5 border ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Sizes</span>
        </h1>
        <div className="flex items-center gap-3">
          {/* Removed duplicate search input; use DataTable's built-in search */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Link
            href="/general/view/all/sizes/rearrange"
            className="px-3 py-2 border rounded bg-white hover:bg-gray-50 flex items-center gap-2"
          >
            <Move className="w-4 h-4" />
            Rearrange Size
          </Link>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setEditing(null); setOpen(true); }}>
            Add New Size
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />

      <SizeModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
        editing={editing ? { name: editing.name, status: editing.status.toLowerCase() } : null}
      />
    </div>
  );
}


