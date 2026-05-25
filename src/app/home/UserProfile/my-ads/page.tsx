"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link' 
import { Megaphone, Edit2, Trash2 } from 'lucide-react' 
import EditAdModal from './components/EditAdModal'
import DeleteAdModal from './components/DeleteAdModal'

export default function MyAdsPage() {
    const { data: session } = useSession()
    const [ads, setAds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // States for Modals
    const [editingAd, setEditingAd] = useState<any | null>(null)
    const [deletingAd, setDeletingAd] = useState<any | null>(null)

    const fetchMyAds = async () => {
        try {
            const token = (session as any)?.accessToken
            if (!token) return

            // ⚠️ নোট: আপনার যদি /profile/classifieds/my-ads রাউট না থাকে, তাহলে এটি /classifieds/ads?user=true বা আপনার নির্দিষ্ট রুট দিয়ে রিপ্লেস করে নিবেন
            const res = await api.get('/profile/classifieds/my-ads', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                setAds(res.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch ads", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) fetchMyAds()
    }, [session])

    if (loading) return <div className="p-8 text-center">Loading your ads...</div>

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-gray-800">My Ads (Buy & Sell)</h1>
                <Link 
                    href="/buy-sell/post-ad" 
                    className="flex items-center gap-2 bg-[#EF4A23] hover:bg-[#d43d1a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <Megaphone className="w-4 h-4" />
                    Post New Ad
                </Link>
            </div>

            {ads.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    You haven't posted any ads yet.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ads.map((ad) => (
                        <div key={ad._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                            <div className="relative h-48 w-full bg-gray-100">
                                <Image 
                                    src={ad.images?.[0] || '/placeholder.png'} 
                                    alt={ad.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                                        {ad.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg truncate" title={ad.title}>{ad.title}</h3>
                                    <p className="text-xl font-bold text-[#EF4A23] mt-1">৳ {ad.price.toLocaleString()}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-400 mt-2 mb-4">
                                        <span>{ad.condition}</span>
                                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {/* ✅ Edit & Delete Buttons */}
                                <div className="pt-3 border-t flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingAd(ad)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition text-sm font-medium"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => setDeletingAd(ad)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition text-sm font-medium"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Modals */}
            {editingAd && (
                <EditAdModal 
                    ad={editingAd} 
                    onClose={() => setEditingAd(null)} 
                    onSuccess={() => { setEditingAd(null); fetchMyAds(); }}
                />
            )}
            {deletingAd && (
                <DeleteAdModal 
                    ad={deletingAd} 
                    onClose={() => setDeletingAd(null)} 
                    onSuccess={() => { setDeletingAd(null); fetchMyAds(); }}
                />
            )}
        </div>
    )
}