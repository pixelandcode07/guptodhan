"use client"
import React, { useState } from 'react'
import { X, Loader2, AlertTriangle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function DeleteAdModal({ ad, onClose, onSuccess }: any) {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const token = (session as any)?.accessToken
            // ✅ DELETE request
            const res = await api.delete(`/classifieds/ads/${ad._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                toast.success("Ad permanently deleted.")
                onSuccess()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete ad.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg text-red-600 flex items-center gap-2">
                        <AlertTriangle size={20} /> Delete Ad
                    </h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 text-center space-y-3">
                    <p className="text-gray-700">Are you sure you want to delete this ad?</p>
                    <p className="font-semibold">"{ad.title}"</p>
                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                        This action cannot be undone. The ad and all its images will be permanently removed.
                    </p>
                </div>
                <div className="p-4 border-t flex justify-end gap-2 bg-gray-50">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Keep Ad</Button>
                    <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Yes, Delete It"}
                    </Button>
                </div>
            </div>
        </div>
    )
}