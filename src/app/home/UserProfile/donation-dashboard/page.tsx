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
        receivedRequests: 0 // ✅ NEW
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

    if (loading) return <div className="p-8 text-center">Loading stats...</div>

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
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {/* ✅ NEW: Requests Received Card */}
                <Card className="bg-blue-50 border-blue-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -z-10 opacity-50"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-blue-900">Received Requests</CardTitle>
                        <Bell className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-blue-700">{stats.receivedRequests || 0}</div>
                        <p className="text-[10px] text-blue-600 mb-3 font-medium uppercase tracking-wider">People requested your items</p>
                        <Link href="/home/UserProfile/received-requests" className="inline-block text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors shadow-sm">
                            Manage Requests →
                        </Link>
                    </CardContent>
                </Card>

                {/* Total Campaigns */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                        <Heart className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                        <p className="text-xs text-muted-foreground">Donations you posted</p>
                    </CardContent>
                </Card>

                {/* Successful Donations */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedCampaigns}</div>
                        <p className="text-xs text-muted-foreground">Items donated</p>
                    </CardContent>
                </Card>

                {/* Total Claims */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Requests</CardTitle>
                        <Gift className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClaims}</div>
                        <p className="text-xs text-muted-foreground">Items you applied for</p>
                    </CardContent>
                </Card>

                {/* Approved Claims */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approvedClaims}</div>
                        <p className="text-xs text-muted-foreground">Accepted by donors</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}