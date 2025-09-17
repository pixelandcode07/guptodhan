import React from 'react'
import OrderSummaryCards from '../../../components/UserProfile/ProfileDashboard/OrderSummaryCards'
import RecentOrdersList from '../../../components/UserProfile/ProfileDashboard/RecentOrdersList'

export default function UserProfilePage() {
    return (
        <div className="">
            <h1 className="text-xl font-semibold px-4 mt-1">Dashboard</h1>
            
            <OrderSummaryCards />
            <RecentOrdersList />
        </div>
    )
}


