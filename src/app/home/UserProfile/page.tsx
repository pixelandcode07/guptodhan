import React from 'react'
import OrderSummaryCards from '@/components/UserProfile/OrderSummaryCards'
import RecentOrdersList from '@/components/UserProfile/RecentOrdersList'

export default function UserProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            
            <OrderSummaryCards />
            <RecentOrdersList />
        </div>
    )
}


