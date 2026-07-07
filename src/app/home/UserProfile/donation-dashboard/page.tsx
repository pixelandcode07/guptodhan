"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Gift, CheckCircle, Clock, ShoppingBag, Bell } from 'lucide-react'
import Link from 'next/link'

export default function DonationDashboardPage() {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        completedCampaigns: 0,
        totalClaims: 0,
        approvedClaims: 0,
        receivedRequests: 0 // ✅ ডাটা রিসিভ করার জন্য স্টেট
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const token = (session as any)?.accessToken
                if (!token) return

                const res = await api.get('/profile/donation/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (res.data.success) {
                    setStats(res.data.data)
                }
            } catch (error) {
                console.error("Failed to fetch stats", error)
            } finally {
                setLoading(false)
            }
        }

        if (session) fetchStats()
    }, [session])

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading stats...</div>

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Donation Overview</h1>
                
                <Link 
                    href="/products" 
                    className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <ShoppingBag className="w-4 h-4" /> Shop Now
                </Link>
            </div>
            
            {/* ✅ MAGIC FIX: সব কার্ডের সাইজ ও ডিজাইন এক করা হলো */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                
                {/* 1. Received Requests Card (New & Clickable) */}
                <Card className="relative overflow-hidden group hover:border-blue-400 transition-colors border-blue-200 bg-blue-50/50">
                    <Link href="/home/UserProfile/received-requests" className="absolute inset-0 z-10">
                        <span className="sr-only">View Received Requests</span>
                    </Link>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Received Requests</CardTitle>
                        <Bell className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{stats.receivedRequests || 0}</div>
                        <p className="text-xs text-blue-600 mt-1 flex items-center justify-between">
                            People requested your items
                            <span className="font-bold group-hover:underline">View &rarr;</span>
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Total Campaigns */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                        <Heart className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCampaigns || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Donations you posted</p>
                    </CardContent>
                </Card>

                {/* 4. Total Claims */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Requests</CardTitle>
                        <Gift className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClaims || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items you applied for</p>
                    </CardContent>
                </Card>

                {/* 5. Approved Claims */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approvedClaims || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requests accepted by donors</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}