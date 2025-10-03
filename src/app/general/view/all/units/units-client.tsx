"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/TableHelper/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Unit, getUnitColumns } from "@/components/TableHelper/unit_columns";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";

type ApiUnit = {
  _id: string
  productUnitId: string
  name: string
  status: "active" | "inactive"
  createdAt: string
}

export default function UnitsClient() {
  const { data: session } = useSession()
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } }
  const s = session as AugmentedSession | null
  const token = s?.accessToken
  const userRole = s?.user?.role
  const [units, setUnits] = useState<Unit[]>([])
  const [, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Unit | null>(null)
  const [form, setForm] = useState<{ name: string; status?: "active" | "inactive" }>({ name: "" })
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("")

  const fetchUnits = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get("/api/v1/product-config/productUnit")
      const apiUnits: ApiUnit[] = data?.data || []
      const mapped: Unit[] = apiUnits.map((u, index) => ({
        _id: u._id,
        id: index + 1,
        productUnitId: u.productUnitId,
        name: u.name,
        status: u.status === "active" ? "Active" : "Inactive",
        created_at: new Date(u.createdAt).toLocaleString(),
      }))
      setUnits(mapped)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const resetForm = () => {
    setForm({ name: "" })
    setEditing(null)
  }

  const deriveProductUnitId = (name: string) => name.trim().toUpperCase().replace(/\s+/g, "_")

  const onSubmit = async () => {
    try {
      if (editing) {
        await axios.patch(`/api/v1/product-config/productUnit/${editing._id}`, {
          name: form.name || editing.name,
          ...(form.status ? { status: form.status } : {}),
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        })
        toast.success("Unit updated")
      } else {
        await axios.post(`/api/v1/product-config/productUnit`, {
          productUnitId: deriveProductUnitId(form.name),
          name: form.name,
          status: "active",
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        })
        toast.success("Unit created")
      }
      await fetchUnits()
      setOpen(false)
      resetForm()
    } catch {
      toast.error("Action failed")
    }
  }

  const onEdit = useCallback((unit: Unit) => {
    setEditing(unit)
    setForm({ name: unit.name, status: unit.status === "Active" ? "active" : "inactive" })
    setOpen(true)
  }, [])

  const onDelete = useCallback(async (unit: Unit) => {
    try {
      await axios.delete(`/api/v1/product-config/productUnit/${unit._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      })
      await fetchUnits()
      toast.success("Unit deleted")
    } catch {
      toast.error("Delete failed")
    }
  }, [token, userRole])

  const columns = useMemo(() => getUnitColumns({ onEdit, onDelete }), [onEdit, onDelete])

  const filteredUnits = useMemo(() => {
    const bySearch = (u: Unit) =>
      !searchText || u.name.toLowerCase().includes(searchText.toLowerCase())
    const byStatus = (u: Unit) =>
      !statusFilter || u.status === statusFilter
    const result = units.filter((u) => bySearch(u) && byStatus(u))
    return result.map((u, idx) => ({ ...u, id: idx + 1 }))
  }, [units, searchText, statusFilter])

  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Units</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" className="border border-gray-500" />
        </span>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setEditing(null); setOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Unit" : "Add New Unit"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Unit</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kilogram" />
              </div>
              {editing && (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="border rounded px-2 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
              <Button onClick={onSubmit}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
       
      </div>

      {/* Table Filters Row */}
      <div className="mb-4 p-3 border bg-gray-50 rounded">
        <div className="grid grid-cols-5 gap-4">
          <div></div>
          <div>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Filter by name..."
              className="w-full text-sm border border-gray-300"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredUnits} />
    </div>
  )
}


