'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { ContactRequestRow, getContactRequestsColumns } from '@/components/TableHelper/contact_requests_columns'
import api from '@/lib/axios'
import { toast } from 'sonner'

interface ApiContactRequest {
  _id: string
  userName: string
  userEmail?: string
  userNumber?: string
  message: string
  status: 'pending' | 'resolved'
  createdAt: string
}

export default function ContactRequestsClient() {
  const [rows, setRows] = useState<ContactRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRow, setEditingRow] = useState<ContactRequestRow | null>(null)
  const [editStatus, setEditStatus] = useState<'pending' | 'resolved'>('pending')

  const fetchContactRequests = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/crm-modules/contact-request')
      const data: ApiContactRequest[] = res.data?.data || []
      
      const mappedData = data.map((item, index) => mapToRow(item, index + 1))
      setRows(mappedData)
    } catch (err) {
      console.error('Failed to fetch contact requests:', err)
      toast.error('Failed to fetch contact requests')
    } finally {
      setLoading(false)
    }
  }, [])

  const mapToRow = (item: ApiContactRequest, sl: number): ContactRequestRow => ({
    id: item._id,
    sl,
    name: item.userName,
    email: item.userEmail || '',
    message: item.message,
    status: item.status === 'pending' ? 'Not Served' : 'Served'
  })

  const onDelete = (row: ContactRequestRow) => {
    setDeletingId(row.id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await api.delete(`/crm-modules/contact-request/${deletingId}`)
      setRows(prev => prev.filter(r => r.id !== deletingId))
      toast.success('Contact request deleted')
    } catch {
      toast.error('Failed to delete contact request')
    } finally {
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const onEdit = (row: ContactRequestRow) => {
    setEditingRow(row)
    setEditStatus(row.status === 'Served' ? 'resolved' : 'pending')
    setShowEditModal(true)
  }

  const handleEditSave = async () => {
    if (!editingRow) return
    try {
      await api.patch(`/crm-modules/contact-request/${editingRow.id}`, { status: editStatus })
      setRows(prev => prev.map(r => r.id === editingRow.id ? { ...r, status: editStatus === 'pending' ? 'Not Served' : 'Served' } : r))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setShowEditModal(false)
      setEditingRow(null)
    }
  }

  const columns = useMemo(() => getContactRequestsColumns(onEdit, onDelete), [])

  useEffect(() => {
    fetchContactRequests()
  }, [fetchContactRequests])

  return (
    <div className="mx-3 my-4 md:mx-6 md:my-8 space-y-4 md:space-y-6">
      <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
        <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
          <h1 className="text-lg font-semibold text-gray-800">Contact Requests</h1>
        </header>
        
        <div className="px-3 py-3 md:px-4 md:py-4">
         
          
          <div className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading contact requests...</div>
              </div>
            ) : (
              <DataTable columns={columns} data={rows} />
            )}
          </div>
        </div>
      </section>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Contact Request</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this request? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white h-10 rounded-md">Delete</button>
              <button onClick={() => { setShowDeleteModal(false); setDeletingId(null); }} className="flex-1 bg-gray-200 text-gray-800 h-10 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingRow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as 'pending' | 'resolved')} className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm">
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleEditSave} className="flex-1 bg-blue-600 text-white h-10 rounded-md">Save</button>
              <button onClick={() => { setShowEditModal(false); setEditingRow(null); }} className="flex-1 bg-gray-200 text-gray-800 h-10 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
