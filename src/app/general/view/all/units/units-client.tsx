"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/TableHelper/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Move } from "lucide-react";
import { Unit, getUnitColumns } from "@/components/TableHelper/unit_columns";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

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
  const [form, setForm] = useState({ name: "" })

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
        }, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        })
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
      }
      await fetchUnits()
      setOpen(false)
      resetForm()
    } catch {
      // ignore
    }
  }

  const onEdit = useCallback((unit: Unit) => {
    setEditing(unit)
    setForm({ name: unit.name })
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
    } catch {
      // ignore
    }
  }, [token, userRole])

  const columns = useMemo(() => getUnitColumns({ onEdit, onDelete }), [onEdit, onDelete])

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
          <Input type="text" className="border border-gray-500" />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
              <Button onClick={onSubmit}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Unit
        </Button>
      </div>

      {/* Table Filters Row */}
      <div className="mb-4 p-3 border bg-gray-50 rounded">
        <div className="grid grid-cols-5 gap-4">
          <div></div>
          <div>
            <Input
              type="text"
              placeholder="Filter by name..."
              className="w-full text-sm border border-gray-300"
            />
          </div>
          <div>
            <select
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

      <DataTable columns={columns} data={units} />
    </div>
  )
}


