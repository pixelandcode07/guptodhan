"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Gift, CheckCircle, Clock, ShoppingBag } from 'lucide-react' // ✅ ShoppingBag আইকন ইম্পোর্ট করা হলো
import Link from 'next/link' // ✅ Link ইম্পোর্ট করা হলো

export default function DonationDashboardPage() {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        completedCampaigns: 0,
        totalClaims: 0,
        approvedClaims: 0
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
            {/* ✅ Donation Overview Heading এবং Shop Now বাটন */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Donation Overview</h1>
                
                <Link 
                    href="/products" 
                    className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                </Link>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

                {/* Completed Campaigns */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Donations</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedCampaigns}</div>
                        <p className="text-xs text-muted-foreground">Items donated successfully</p>
                    </CardContent>
                </Card>

                {/* Total Claims */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Requests</CardTitle>
                        <Gift className="h-4 w-4 text-blue-500" />
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
                        <p className="text-xs text-muted-foreground">Requests accepted by donors</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}