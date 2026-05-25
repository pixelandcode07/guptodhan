"use client"
import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditAdModal({ ad, onClose, onSuccess }: any) {
    const { data: session } = useSession()
    const [title, setTitle] = useState(ad.title)
    const [price, setPrice] = useState(ad.price)
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = (session as any)?.accessToken
            // ✅ PATCH request
            const res = await api.patch(`/classifieds/ads/${ad._id}`, 
                { title, price: Number(price) }, 
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res.data.success) {
                toast.success("Ad updated successfully! Waiting for admin review.")
                onSuccess()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update ad.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Edit Ad</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleUpdate} className="p-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Ad Title</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Price (৳)</label>
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    
                    <div className="bg-yellow-50 text-yellow-700 text-xs p-3 rounded-md border border-yellow-200">
                        <strong>Security Note:</strong> Editing this ad will temporarily hide it from the public (Pending Status) until reviewed by our team.
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#EF4A23] hover:bg-[#d43d1a] text-white">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Update Ad"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}