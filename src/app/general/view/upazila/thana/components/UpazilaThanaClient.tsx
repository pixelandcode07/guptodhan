"use client"

import React from "react"
import { DataTable } from "@/components/TableHelper/data-table"
import { getUpazilaThanaColumns, UpazilaThana } from "@/components/TableHelper/upazila_thana_columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import api from "@/lib/axios"
import { toast } from "sonner"

type ApiUpazila = {
  _id: string
  district: string
  upazilaThanaEnglish: string
  upazilaThanaBangla: string
  websiteLink?: string
  createdAt?: string
}

function mapToRow(item: ApiUpazila, index: number): UpazilaThana {
  return {
    _id: item._id,
    id: index + 1,
    district: item.district,
    upazila_thana_english: item.upazilaThanaEnglish,
    upazila_thana_bangla: item.upazilaThanaBangla,
    website: item.websiteLink || "-",
  }
}

export default function UpazilaThanaClient() {
  const [rows, setRows] = React.useState<UpazilaThana[]>([])
  const [districts, setDistricts] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pendingDelete, setPendingDelete] = React.useState<UpazilaThana | null>(null)

  const [district, setDistrict] = React.useState("")
  const [nameEn, setNameEn] = React.useState("")
  const [nameBn, setNameBn] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | undefined>(undefined)

  const fetchList = React.useCallback(() => {
    setLoading(true)
    api.get("/upazila-thana")
      .then(res => {
        const list = (res.data?.data ?? []) as ApiUpazila[]
        setRows(list.map(mapToRow))
        
        // Extract unique districts from the API data
        const uniqueDistricts = Array.from(new Set(list.map(item => item.district).filter(Boolean)))
        setDistricts(uniqueDistricts.sort())
      })
      .catch(() => {
        setRows([])
        setDistricts([])
      })
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    fetchList()
  }, [fetchList])

  const filtered = React.useMemo(() => {
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter(r =>
      r.district.toLowerCase().includes(q) ||
      r.upazila_thana_english.toLowerCase().includes(q) ||
      r.upazila_thana_bangla.toLowerCase().includes(q) ||
      r.website.toLowerCase().includes(q)
    )
  }, [rows, search])

  const onEdit = (row: UpazilaThana) => {
    setOpen(true)
    setDistrict(row.district)
    setNameEn(row.upazila_thana_english)
    setNameBn(row.upazila_thana_bangla)
    setWebsite(row.website && row.website !== '-' ? row.website : '')
    setEditingId(row._id)
  }

  const onDelete = (row: UpazilaThana) => {
    setPendingDelete(row)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    const target = pendingDelete
    if (!target || !target._id) { setConfirmOpen(false); return }
    try {
      setLoading(true)
      await api.delete(`/upazila-thana/${target._id}`)
      toast.success('Deleted successfully')
      setConfirmOpen(false)
      setPendingDelete(null)
      fetchList()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const onCreate = async () => {
    if (!district || !nameEn || !nameBn) {
      toast.error("Please fill required fields: District, Name (English) and Name (Bangla)")
      return
    }
    try {
      setLoading(true)
      const websiteLink = website
        ? (/^https?:\/\//i.test(website) ? website : `https://${website}`)
        : undefined
      if (editingId) {
        await api.patch(`/upazila-thana/${editingId}` , {
          district,
          upazilaThanaEnglish: nameEn,
          upazilaThanaBangla: nameBn,
          websiteLink,
        })
        toast.success("Upazila/Thana updated successfully")
      } else {
        await api.post("/upazila-thana", {
          district,
          upazilaThanaEnglish: nameEn,
          upazilaThanaBangla: nameBn,
          websiteLink,
        })
        toast.success("Upazila/Thana created successfully")
      }
      setOpen(false)
      setDistrict("")
      setNameEn("")
      setNameBn("")
      setWebsite("")
      setEditingId(undefined)
      fetchList()
    } catch {
      toast.error("Failed to create Upazila/Thana")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setOpen(false)
    setDistrict("")
    setNameEn("")
    setNameBn("")
    setWebsite("")
    setEditingId(undefined)
  }

  return (
    <div className="mx-3 my-4 md:mx-6 md:my-8 space-y-4 md:space-y-6">
      <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
        <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
          <h1 className="text-sm md:text-base font-semibold text-gray-900">Upazila & Thana List</h1>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-700">Search:</span>
              <Input value={search} onChange={e=>setSearch(e.target.value)} className="h-9 w-48 border border-gray-300 rounded-md" />
            </div>
            <Button className="h-9 bg-green-600 hover:bg-green-700" onClick={()=>setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Upazila/Thana
            </Button>
          </div>
        </header>
        <div className="sm:hidden px-3 pt-3">
          <Input value={search} onChange={e=>setSearch(e.target.value)} className="h-9 w-full border border-gray-300 rounded-md" placeholder="Search..." />
        </div>
        <div className="p-3 md:p-4">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <DataTable columns={getUpazilaThanaColumns({ onEdit, onDelete })} data={filtered} />
              {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>}
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[92%] max-w-lg rounded-md bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">{editingId ? 'Edit' : 'Add New'} Upazila/Thana</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">District<span className="text-rose-600">*</span></label>
                <select 
                  value={district} 
                  onChange={e=>setDistrict(e.target.value)} 
                  className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={loading}
                >
                  <option value="">Select One</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Upazila/Thana Name (English)<span className="text-rose-600">*</span></label>
                <input 
                  value={nameEn} 
                  onChange={e=>setNameEn(e.target.value)} 
                  className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
                  placeholder="Enter name in English"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Upazila/Thana Name (Bangla)<span className="text-rose-600">*</span></label>
                <input 
                  value={nameBn} 
                  onChange={e=>setNameBn(e.target.value)} 
                  className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
                  placeholder="Enter name in Bangla"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                <input 
                  value={website} 
                  onChange={e=>setWebsite(e.target.value)} 
                  className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
                  placeholder="https://"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
              <Button variant="secondary" className="h-9" onClick={handleCloseModal} disabled={loading}>Close</Button>
              <Button className="h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-60" onClick={onCreate} disabled={loading}>
                {loading ? "Saving..." : "Save Now"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[92%] max-w-md rounded-md bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Delete Upazila/Thana</h3>
              <button onClick={()=>setConfirmOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              Are you sure you want to delete
              {pendingDelete ? (
                <>
                  {' '}<span className="font-medium">{pendingDelete.upazila_thana_english}</span>
                  {pendingDelete.district ? ` (${pendingDelete.district})` : ''}?
                </>
              ) : ' this item?'}
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
              <Button variant="secondary" className="h-9" onClick={()=>setConfirmOpen(false)} disabled={loading}>Cancel</Button>
              <Button className="h-9 bg-red-600 hover:bg-red-700 disabled:opacity-60" onClick={confirmDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
