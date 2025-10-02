"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/TableHelper/data-table";
import { getStorageColumns, type Storage } from "@/components/TableHelper/storage_columns";
import Link from "next/link";
import { Move } from "lucide-react";
import StorageModal from "./StorageModal";

type ApiStorage = {
  _id: string;
  storageTypeId: string;
  ram: string;
  rom: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function StoragesClient() {
  const { data: session } = useSession();
  type AugmentedSession = { accessToken?: string; user?: { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [rows, setRows] = useState<Storage[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Storage | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/product-config/storageType", { params: { _ts: Date.now() } });
      const items: ApiStorage[] = res.data.data;
      const mapped: Storage[] = items.map((it, index) => ({
        _id: it._id,
        storageTypeId: it.storageTypeId,
        id: index + 1,
        ram: it.ram,
        rom: it.rom,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e) {
      console.error("Error fetching storages:", e);
      toast.error("Failed to fetch storage types");
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const deriveStorageTypeId = (ram: string, rom: string) => `${ram}-${rom}`.toLowerCase().replace(/\s+/g, '-');

  const onSubmit = async (data: { ram: string; rom: string; status?: string }) => {
    try {
      const payload: Record<string, unknown> = {
        storageTypeId: deriveStorageTypeId(data.ram, data.rom),
        ram: data.ram,
        rom: data.rom,
        ...(editing && data.status ? { status: data.status } : {}),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/storageType/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Storage updated successfully!");
        setRows(prev => prev.map(r => r._id === editing._id ? {
          ...r,
          ram: payload.ram as string,
          rom: payload.rom as string,
          status: (payload.status === 'inactive') ? 'Inactive' : 'Active',
        } : r));
      } else {
        const res = await axios.post(`/api/v1/product-config/storageType`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        const created: ApiStorage | undefined = res?.data?.data;
        if (created) {
          setRows(prev => [{
            _id: created._id,
            storageTypeId: created.storageTypeId,
            id: (prev[0]?.id ?? 0) + 1,
            ram: created.ram,
            rom: created.rom,
            status: created.status === 'inactive' ? 'Inactive' : 'Active',
            created_at: created.createdAt || new Date().toISOString(),
          }, ...prev]);
        }
        toast.success("Storage created successfully!");
      }

      setOpen(false);
      setEditing(null);
      await fetchRows();
    } catch (e) {
      console.error("Error saving storage:", e);
      toast.error(`Failed to ${editing ? 'update' : 'create'} storage`);
    }
  };

  const onDelete = useCallback(async (row: Storage) => {
    try {
      if (!row._id) return;
      await axios.delete(`/api/v1/product-config/storageType/${row._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      setRows(prev => prev.filter(r => r._id !== row._id));
      toast.success("Storage deleted successfully!");
    } catch (e) {
      console.error("Error deleting storage:", e);
      toast.error("Failed to delete storage");
    }
  }, [token, userRole]);

  const columns = useMemo(() => getStorageColumns({ onEdit: (r)=>{ setEditing(r); setOpen(true); }, onDelete }), [onDelete]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
      return matchesStatus;
    });
  }, [rows, statusFilter]);

  return (
    <div className="m-5 p-5 border ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Storage Types</span>
        </h1>
        <div className="flex items-center gap-3">
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
          <Link href="/general/view/all/storages/rearrange" className="px-3 py-2 border rounded bg-white hover:bg-gray-50 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Rearrange Storage Type
          </Link>
          <Button className="bg-green-600 hover:bg-green-700" onClick={()=>{ setEditing(null); setOpen(true); }}>
            Add New Storage Type
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
      <StorageModal open={open} onOpenChange={setOpen} onSubmit={onSubmit} editing={editing ? { ram: editing.ram, rom: editing.rom, status: editing.status.toLowerCase() } : null} />
    </div>
  );
}


