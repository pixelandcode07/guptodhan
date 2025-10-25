import React from 'react'
import OrdersPage from '../components/OrdersPage'

export default function CancelledOrdersPage() {
    return (
        <div className='max-w-[1400px] mx-auto'>
            <OrdersPage initialStatus="cancelled" />
        </div>
    )
}
