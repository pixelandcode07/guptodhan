import React from 'react'
import OrdersPage from '../components/OrdersPage'

export default function InTransitOrdersPage() {
    return (
        <div className='max-w-[1400px] mx-auto'>
            <OrdersPage initialStatus="in-transit" />
        </div>
    )
}
