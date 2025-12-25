'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { SubscribedUserRow, getSubscribedUsersColumns } from '@/components/TableHelper/subscribed_users_columns'
import axios from 'axios'
import { toast } from 'sonner'

interface SubscribedUsersClientProps {
  initialRows: SubscribedUserRow[];
}

export default function SubscribedUsersClient({ initialRows }: SubscribedUsersClientProps) {
  const [rows, setRows] = useState<SubscribedUserRow[]>(initialRows || [])
  const [loading, setLoading] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setRows(initialRows || [])
  }, [initialRows])

  const escapeCsv = (value: string) => {
    const needsQuotes = /[",\n]/.test(value)
    const escaped = value.replace(/"/g, '""')
    return needsQuotes ? `"${escaped}"` : escaped
  }

  const handleDownloadCsv = () => {
    if (!rows.length) {
      toast.info('No data to download')
      return
    }
    const headers = ['SL', 'Email', 'Subscribed On']
    const lines = [headers.join(',')]
    for (const r of rows) {
      lines.push([
        escapeCsv(String(r.sl)),
        escapeCsv(r.email ?? ''),
        escapeCsv(r.subscribedOn ?? ''),
      ].join(','))
    }
    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')
    a.download = `subscribed-users-${ts}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const onDelete = (row: SubscribedUserRow) => {
    setDeletingId(row.id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await toast.promise(
        axios.delete(`/api/v1/users/${deletingId}`),
        {
          loading: 'Deleting...',
          success: 'User deleted successfully!',
          error: (err) => err.response?.data?.message || 'Failed to delete user',
        }
      )
      setRows(prev => prev.filter(r => r.id !== deletingId))
    } catch (err) {
      console.error('Failed to delete user:', err)
    } finally {
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const columns = useMemo(() => getSubscribedUsersColumns(onDelete), [])

  return (
    <section className="mx-3 my-4 md:mx-6 md:my-8 space-y-4 md:space-y-6">
      <div className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
        <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
          <h1 className="text-lg font-semibold text-gray-800">Subscribed Users</h1>
          <button onClick={handleDownloadCsv} className="h-9 rounded-md px-4 bg-gray-900 text-white hover:bg-gray-800">Download CSV</button>
        </header>
        <div className="px-3 py-3 md:px-4 md:py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">Loading subscribers...</div>
          ) : (
            <DataTable columns={columns} data={rows} />
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Subscriber</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this subscriber? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white h-10 rounded-md">Delete</button>
              <button onClick={() => { setShowDeleteModal(false); setDeletingId(null); }} className="flex-1 bg-gray-200 text-gray-800 h-10 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


