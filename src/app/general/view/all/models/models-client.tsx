"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/TableHelper/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import Link from "next/link";
import { Model, getModelColumns } from "@/components/TableHelper/model_columns";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApiModel = {
  _id: string
  modelFormId: string
  brand: string
  brandName: string
  modelName: string
  modelCode: string
  status: "active" | "inactive"
  createdAt: string
}

export default function ModelsClient() {
  const { data: session } = useSession()
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } }
  const s = session as AugmentedSession | null
  const token = s?.accessToken
  const userRole = s?.user?.role

  const [models, setModels] = useState<Model[]>([])
  const [, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("")

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Model | null>(null)
  const [editForm, setEditForm] = useState({
    modelName: "",
    modelCode: "",
    status: "Active" as "Active" | "Inactive",
  })

  const fetchModels = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get("/api/v1/product-config/modelName")
      const apiModels: ApiModel[] = data?.data || []
      const mapped: Model[] = apiModels.map((m, index) => ({
        _id: m._id,
        id: index + 1,
        brand: m.brandName || "Unknown",
        modelName: m.modelName,
        code: m.modelCode,
        slug: m.modelFormId,
        status: m.status === "active" ? "Active" : "Inactive",
        created_at: new Date(m.createdAt).toLocaleString(),
      }))
      setModels(mapped)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const onEdit = useCallback((model: Model) => {
    setEditing(model)
    setEditForm({
      modelName: model.modelName,
      modelCode: model.code,
      status: model.status,
    })
    setEditOpen(true)
  }, [])

  const onDelete = useCallback(async (model: Model) => {
    try {
      await axios.delete(`/api/v1/product-config/modelName/${model._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      })
      await fetchModels()
      toast.success("Model deleted")
    } catch {
      toast.error("Delete failed")
    }
  }, [token, userRole])

  const columns = useMemo(() => getModelColumns({ onEdit, onDelete }), [onEdit, onDelete])

  const filteredModels = useMemo(() => {
    const bySearch = (m: Model) =>
      !searchText || m.modelName.toLowerCase().includes(searchText.toLowerCase()) || m.brand.toLowerCase().includes(searchText.toLowerCase())
    const byStatus = (m: Model) =>
      !statusFilter || m.status === statusFilter
    const result = models.filter((m) => bySearch(m) && byStatus(m))
    return result.map((m, idx) => ({ ...m, id: idx + 1 }))
  }, [models, searchText, statusFilter])

  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Models</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/general/add/new/model">
            <Plus className="w-4 h-4 mr-2" />
            Add New Model
          </Link>
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Model
        </Button>
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
              placeholder="Filter by name or brand..."
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

      <DataTable columns={columns} data={filteredModels} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Model Name</Label>
              <div className="col-span-3">
                <Input value={editForm.modelName} onChange={(e) => setEditForm({ ...editForm, modelName: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Model Code</Label>
              <div className="col-span-3">
                <Input value={editForm.modelCode} onChange={(e) => setEditForm({ ...editForm, modelCode: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as typeof editForm.status })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!editing) return
                try {
                  await axios.patch(`/api/v1/product-config/modelName/${editing._id}`, {
                    modelName: editForm.modelName,
                    modelCode: editForm.modelCode,
                    status: editForm.status === "Active" ? "active" : "inactive",
                    modelFormId: editForm.modelName.trim().toLowerCase().replace(/\s+/g, "-"),
                  }, {
                    headers: {
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      ...(userRole ? { "x-user-role": userRole } : {}),
                      "Content-Type": "application/json",
                    }
                  })
                  toast.success("Model updated")
                  setEditOpen(false)
                  await fetchModels()
                } catch {
                  toast.error("Update failed")
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
