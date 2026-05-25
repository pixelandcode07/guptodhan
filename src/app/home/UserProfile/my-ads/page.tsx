"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link' 
import { Badge } from '@/components/ui/badge'
import { Megaphone, Edit2, Trash2, Loader2, PackageX } from 'lucide-react' 

import EditAdModal from './components/EditAdModal'
import DeleteAdModal from './components/DeleteAdModal'

export default function MyAdsPage() {
    const { data: session, status } = useSession()
    const [ads, setAds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // States for Modals
    const [editingAd, setEditingAd] = useState<any | null>(null)
    const [deletingAd, setDeletingAd] = useState<any | null>(null)

    // ✅ Fetch User's Ads
    const fetchMyAds = useCallback(async () => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            setLoading(false);
            return;
        }

        try {
            const token = (session as any)?.accessToken
            if (!token) return

            const res = await api.get('/classifieds/ads?user=true', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                setAds(res.data.data)
            } else {
                setAds([])
            }
        } catch (error) {
            console.error("Failed to fetch ads", error)
            setAds([])
        } finally {
            setLoading(false)
        }
    }, [session, status])

    useEffect(() => {
        fetchMyAds()
    }, [fetchMyAds])

    // ✅ Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#EF4A23]" />
                <span className="ml-3 text-gray-600 font-medium">Loading your ads...</span>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6">
            {/* ✅ Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl font-semibold text-gray-800">My Ads (Buy & Sell)</h1>
                <Link 
                    href="/buy-sell/post-ad" 
                    className="flex items-center justify-center gap-2 bg-[#EF4A23] hover:bg-[#d43d1a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <Megaphone className="w-4 h-4" />
                    Post New Ad
                </Link>
            </div>

            {/* ✅ Empty State */}
            {ads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <PackageX className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Ads Found</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-center max-w-sm">
                        You haven't posted any classified ads yet. Start selling your items today!
                    </p>
                    <Link 
                        href="/buy-sell/post-ad" 
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Post an Ad Now
                    </Link>
                </div>
            ) : (
                /* ✅ Ads Grid */
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {ads.map((ad) => (
                        <div key={ad._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col group">
                            
                            {/* Image Section */}
                            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                <Image 
                                    src={ad.images?.[0] || '/placeholder.png'} 
                                    alt={ad.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = '/img/product/p-1.png';
                                    }}
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge 
                                        className={`px-2.5 py-0.5 font-semibold tracking-wide shadow-sm border-0 ${
                                            ad.status === 'active' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                                            ad.status === 'pending' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                            'bg-gray-500 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        {ad.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 truncate" title={ad.title}>
                                        {ad.title}
                                    </h3>
                                    <p className="text-xl font-bold text-[#EF4A23] mt-1.5">
                                        ৳ {ad.price?.toLocaleString('en-US') || 0}
                                    </p>
                                    
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3 mb-4 bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <span className="font-medium">{ad.condition || 'Used'}</span>
                                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingAd(ad)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-semibold"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => setDeletingAd(ad)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-semibold"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Modals Container */}
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