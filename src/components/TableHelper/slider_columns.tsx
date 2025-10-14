"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Avoid exporting types to prevent deploy issues per request

export const slider_columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "slider",
    header: "Slider",
    cell: ({ row }) => {
      const slider = row.getValue("slider") as string;
      return (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
          {slider ? (
            <img src={slider} alt="Slider" className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_title",
    header: "Sub Title",
    cell: ({ row }) => {
      const subTitle = row.getValue("sub_title") as string;
      return (
        <div className="max-w-xs truncate" title={subTitle}>
          {subTitle || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "slider_link",
    header: "Slider Link",
    cell: ({ row }) => {
      const sliderLink = row.getValue("slider_link") as string;
      return (
        <div className="max-w-xs truncate text-blue-600" title={sliderLink}>
          {sliderLink || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "button_text",
    header: "Button Text",
    cell: ({ row }) => {
      const buttonText = row.getValue("button_text") as string;
      return (
        <div className="font-medium text-blue-600">
          {buttonText || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "button_link",
    header: "Button Link",
    cell: ({ row }) => {
      const buttonLink = row.getValue("button_link") as string;
      return (
        <div className="max-w-xs truncate text-blue-600" title={buttonLink}>
          {buttonLink || "-"}
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
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original as any;
      const [open, setOpen] = useState(false)
      const [form, setForm] = useState<any>({
        image: item?.slider || "",
        textPosition: item?.textPosition || "",
        sliderLink: item?.slider_link || "",
        subTitleWithColor: item?.sub_title || "",
        bannerTitleWithColor: item?.title || "",
        bannerDescriptionWithColor: item?.bannerDescriptionWithColor || "",
        buttonWithColor: item?.button_text || "",
        buttonLink: item?.button_link || "",
        status: item?.status === 'Active' ? 'active' : 'inactive',
      })

      const onChange = (key: string, value: any) => setForm((p: any) => ({ ...p, [key]: value }))

      const onUpdate = async () => {
        if (!item?._id) return;
        await toast.promise(
          (async () => {
            const res = await fetch(`/api/v1/slider-form/${item._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form),
            })
            if (!res.ok) {
              const j = await res.json().catch(() => ({}));
              throw new Error(j?.message || 'Update failed')
            }
          })(),
          { loading: 'Updating...', success: 'Slider updated', error: (e) => e?.message || 'Update failed' }
        )
        setOpen(false)
        // notify client wrapper to merge update
        window.dispatchEvent(new CustomEvent('slider-updated', { detail: { _id: item._id, update: form } }))
      }

      const onDelete = async () => {
        const item = row.original as any;
        if (!item?._id) return;
        toast.warning('Delete this slider?', {
          description: 'This action cannot be undone.',
          action: {
            label: 'Delete',
            onClick: async () => {
              await toast.promise(
                (async () => {
                  const res = await fetch(`/api/v1/slider-form/${item._id}`, { method: 'DELETE' });
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message || 'Failed to delete');
                  }
                })(),
                {
                  loading: 'Deleting...',
                  success: 'Slider deleted',
                  error: (e) => e?.message || 'Delete failed',
                }
              );
              // notify client wrapper to remove without refresh
              window.dispatchEvent(new CustomEvent('slider-deleted', { detail: { _id: item._id } }))
            },
          },
        });
      };
      return (
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Slider</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Image URL</label>
                  <Input value={form.image} onChange={(e) => onChange('image', e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Text Position</label>
                  <Input value={form.textPosition} onChange={(e) => onChange('textPosition', e.target.value)} placeholder="Left | Right" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Slider Link</label>
                  <Input value={form.sliderLink} onChange={(e) => onChange('sliderLink', e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Sub Title</label>
                  <Input value={form.subTitleWithColor} onChange={(e) => onChange('subTitleWithColor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Banner Title</label>
                  <Input value={form.bannerTitleWithColor} onChange={(e) => onChange('bannerTitleWithColor', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm">Banner Description</label>
                  <Textarea value={form.bannerDescriptionWithColor} onChange={(e) => onChange('bannerDescriptionWithColor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Button Text</label>
                  <Input value={form.buttonWithColor} onChange={(e) => onChange('buttonWithColor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Button Link</label>
                  <Input value={form.buttonLink} onChange={(e) => onChange('buttonLink', e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Status</label>
                  <Select value={form.status} onValueChange={(v) => onChange('status', v)}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onUpdate}>Save Changes</Button>
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
