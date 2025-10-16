'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { SubscribedUserRow, getSubscribedUsersColumns } from '@/components/TableHelper/subscribed_users_columns'
import api from '@/lib/axios'
import { toast } from 'sonner'

interface ApiSubscriber {
  _id: string
  userEmail: string
  subscribedOn: string
}

export default function SubscribedUsersClient() {
  const [rows, setRows] = useState<SubscribedUserRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/crm-modules/subscribed-users')
      const data: ApiSubscriber[] = res.data?.data || []
      const mapped = data.map((it, idx) => ({
        id: it._id,
        sl: idx + 1,
        email: it.userEmail,
        subscribedOn: new Date(it.subscribedOn).toLocaleString(),
      }))
      setRows(mapped)
    } catch (err) {
      console.error('Failed to fetch subscribed users:', err)
      toast.error('Failed to fetch subscribed users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const onDelete = (row: SubscribedUserRow) => {
    setDeletingId(row.id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await api.delete(`/crm-modules/subscribed-users/${deletingId}`)
      setRows(prev => prev.filter(r => r.id !== deletingId))
      toast.success('Subscriber deleted')
    } catch (err) {
      console.error('Failed to delete subscriber:', err)
      toast.error('Failed to delete subscriber')
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


