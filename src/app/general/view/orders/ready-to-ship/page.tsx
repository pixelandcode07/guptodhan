import React from 'react'
import OrdersPage from '../components/OrdersPage'

export default function ReadyToShipOrdersPage() {
    return (
        <div className='max-w-[1400px] mx-auto'>
            <OrdersPage initialStatus="ready-to-ship" />
        </div>
    )
}
