"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link' 
import { ShoppingBag, Edit2 } from 'lucide-react' 
import EditCampaignModal from './components/EditCampaignModal'

export default function MyCampaignsPage() {
    const { data: session } = useSession()
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // ✅ এডিট করার জন্য স্টেট
    const [editingCampaign, setEditingCampaign] = useState<any | null>(null)

    const fetchCampaigns = async () => {
        try {
            const token = (session as any)?.accessToken
            if (!token) return

            const res = await api.get('/profile/donation/my-campaigns', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                setCampaigns(res.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) fetchCampaigns()
    }, [session])

    if (loading) return <div className="p-8 text-center">Loading campaigns...</div>

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-gray-800">My Donation Campaigns</h1>
                <Link 
                    href="/products" 
                    className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    You haven't posted any donations yet.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((camp) => (
                        <div key={camp._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                            <div className="relative h-48 w-full bg-gray-100">
                                <Image 
                                    src={camp.images?.[0] || '/placeholder.png'} 
                                    alt={camp.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant={camp.status === 'active' ? 'default' : 'secondary'}>
                                        {camp.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg truncate" title={camp.title}>{camp.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{camp.category?.name || 'Category'}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                                        <span>Type: {camp.item}</span>
                                        <span>{new Date(camp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {/* ✅ শুধুমাত্র Edit Button (No Delete) */}
                                <div className="pt-3 border-t flex justify-end">
                                    <button 
                                        onClick={() => setEditingCampaign(camp)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition text-sm font-medium"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Edit Modal */}
            {editingCampaign && (
                <EditCampaignModal 
                    campaign={editingCampaign} 
                    onClose={() => setEditingCampaign(null)} 
                    onSuccess={() => {
                        setEditingCampaign(null);
                        fetchCampaigns(); // ডাটা রিফ্রেশ
                    }}
                />
            )}
        </div>
    )
}