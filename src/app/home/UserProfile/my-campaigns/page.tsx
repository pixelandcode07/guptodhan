"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link' // ✅ Link ইম্পোর্ট করা হলো
import { ShoppingBag } from 'lucide-react' // ✅ আইকন ইম্পোর্ট করা হলো

export default function MyCampaignsPage() {
    const { data: session } = useSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        if (session) fetchCampaigns()
    }, [session])

    if (loading) return <div className="p-8 text-center">Loading campaigns...</div>

    return (
        <div className="p-6">
            {/* ✅ My Donation Campaigns Heading এবং Shop Now বাটন */}
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
                        <div key={camp._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
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
                            <div className="p-4">
                                <h3 className="font-semibold text-lg truncate" title={camp.title}>{camp.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">{camp.category?.name || 'Category'}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>Type: {camp.item}</span>
                                    <span>{new Date(camp.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}