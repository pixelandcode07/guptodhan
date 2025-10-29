import React from 'react'
import OrdersPage from '../components/OrdersPage'

export default function ApprovedOrdersPage() {
    return (
        <div className='max-w-[1400px] mx-auto'>
            <OrdersPage initialStatus="approved" />
        </div>
    )
}
