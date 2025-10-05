"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export type PromoCode = {
  id: number
  title: string
  effective_date: string
  expiry_date: string
  type: "Percentage" | "Fixed Amount"
  value: string
  min_spend: string
  code: string
  status: "Active" | "Inactive" | "Expired"
}

export const promo_codes_columns: ColumnDef<PromoCode>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "effective_date",
    header: "Effective Date",
    cell: ({ row }) => {
      const date = row.getValue("effective_date") as string;
      return (
        <div className="text-sm">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "expiry_date",
    header: "Expiry Date",
    cell: ({ row }) => {
      const date = row.getValue("expiry_date") as string;
      return (
        <div className="text-sm">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          type === "Percentage"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value") as string;
      return (
        <div className="font-mono text-sm">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "min_spend",
    header: "Min. Spend",
    cell: ({ row }) => {
      const minSpend = row.getValue("min_spend") as string;
      return (
        <div className="font-mono text-sm">
          {minSpend}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {code}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active"
            ? "bg-green-100 text-green-800"
            : status === "Inactive"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original as any
      const [open, setOpen] = useState(false)
      const [form, setForm] = useState<any>({
        title: item?.title || "",
        icon: item?.icon || "",
        startDate: item?.effective_date || "",
        endingDate: item?.expiry_date || "",
        type: item?.type || "",
        shortDescription: item?.shortDescription || "",
        value: Number(String(item?.value || '').replace(/[^0-9.]/g, '')) || 0,
        minimumOrderAmount: Number(item?.min_spend || 0),
        code: item?.code || "",
        status: item?.status === 'Active' ? 'active' : 'inactive',
      })

      const onChange = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
      const onDelete = async () => {
        if (!item?._id) return
        toast.warning('Delete this promo code?', {
          description: 'This action cannot be undone.',
          action: {
            label: 'Delete',
            onClick: async () => {
              await toast.promise(
                (async () => {
                  const res = await fetch(`/api/v1/promo-code/${item._id}`, { method: 'DELETE' })
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}))
                    throw new Error(j?.message || 'Failed to delete')
                  }
                })(),
                { loading: 'Deleting...', success: 'Promo code deleted', error: (e) => e?.message || 'Delete failed' }
              )
              window.dispatchEvent(new CustomEvent('promo-deleted', { detail: { _id: item._id } }))
            },
          },
        })
      }
      return (
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Promo Code</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm">Title</label>
                  <Input value={form.title} onChange={(e) => onChange('title', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm">Icon URL</label>
                  <Input value={form.icon} onChange={(e) => onChange('icon', e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Effective Date</label>
                  <Input type="date" value={form.startDate} onChange={(e) => onChange('startDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Expiry Date</label>
                  <Input type="date" value={form.endingDate} onChange={(e) => onChange('endingDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Type</label>
                  <Select value={form.type} onValueChange={(v) => onChange('type', v)}>
                    <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Value</label>
                  <Input type="number" value={form.value} onChange={(e) => onChange('value', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm">Minimum Order Amount</label>
                  <Input type="number" value={form.minimumOrderAmount} onChange={(e) => onChange('minimumOrderAmount', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm">Code</label>
                  <Input value={form.code} onChange={(e) => onChange('code', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm">Short Description</label>
                  <Textarea value={form.shortDescription} onChange={(e) => onChange('shortDescription', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Status</label>
                  <Select value={form.status} onValueChange={(v) => onChange('status', v)}>
                    <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  const payload = {
                    ...form,
                    value: Number(form.value),
                    minimumOrderAmount: Number(form.minimumOrderAmount),
                  }
                  await toast.promise(
                    (async () => {
                      const res = await fetch(`/api/v1/promo-code/${item._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                      if (!res.ok) {
                        const j = await res.json().catch(() => ({}))
                        throw new Error(j?.message || 'Update failed')
                      }
                    })(),
                    { loading: 'Updating...', success: 'Promo updated', error: (e) => e?.message || 'Update failed' }
                  )
                  setOpen(false)
                  window.dispatchEvent(new CustomEvent('promo-updated', { detail: { _id: item._id, update: payload } }))
                }}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
