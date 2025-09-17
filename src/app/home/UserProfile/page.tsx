import React from 'react'
import OrderSummaryCards from '../../../components/UserProfile/ProfileDashboard/OrderSummaryCards'
import RecentOrdersList from '../../../components/UserProfile/ProfileDashboard/RecentOrdersList'

export default function UserProfilePage() {
    // Centralize orders so both summary and list stay in sync (swap with API data later)
    const orders = [
        {
            id: '1',
            seller: 'TechStore Pro',
            sellerVerified: true,
            status: 'cancelled' as const,
            productName: 'Braun Silk-épil 9 Cordless Epilator',
            productImage: '/img/product/p-1.png',
            size: 'XL',
            color: 'Green',
            price: '৳ 7,200',
            quantity: 1,
        },
        {
            id: '2',
            seller: 'TechStore Pro',
            sellerVerified: true,
            status: 'delivered' as const,
            productName: 'Braun Silk-épil 9 Cordless Epilator',
            productImage: '/img/product/p-2.png',
            size: 'XL',
            color: 'Green',
            price: '৳ 7,200',
            quantity: 1,
        },
        {
            id: '3',
            seller: 'TechStore Pro',
            sellerVerified: true,
            status: 'processing' as const,
            productName: 'Braun Silk-épil 9 Cordless Epilator',
            productImage: '/img/product/p-3.png',
            size: 'XL',
            color: 'Green',
            price: '৳ 7,200',
            quantity: 1,
        },
        {
            id: '4',
            seller: 'TechStore Pro',
            sellerVerified: true,
            status: 'pending' as const,
            productName: 'Braun Silk-épil 9 Cordless Epilator',
            productImage: '/img/product/p-4.png',
            size: 'XL',
            color: 'Green',
            price: '৳ 7,200',
            quantity: 1,
        },
    ]

    const counts = orders.reduce(
        (acc, o) => {
            acc.pending += o.status === 'pending' ? 1 : 0
            acc.processing += o.status === 'processing' ? 1 : 0
            acc.delivered += o.status === 'delivered' ? 1 : 0
            acc.cancelled += o.status === 'cancelled' ? 1 : 0
            return acc
        },
        { pending: 0, processing: 0, delivered: 0, cancelled: 0 }
    )

    return (
        <div className="">
            <h1 className="text-xl font-semibold px-4 mt-1">Dashboard</h1>
            <OrderSummaryCards 
                pending={counts.pending}
                processing={counts.processing}
                delivered={counts.delivered}
                cancelled={counts.cancelled}
            />
            <RecentOrdersList orders={orders} />
        </div>
    )
}


