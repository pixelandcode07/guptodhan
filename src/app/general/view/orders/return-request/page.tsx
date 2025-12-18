import React from 'react'
import OrdersPage from '../components/OrdersPage'

export default function ReturnRequestOrdersPage() {
    return (
        <div className='max-w-[1400px] mx-auto'>
            {/* initialStatus="return-request" পাস করা হচ্ছে */}
            <OrdersPage initialStatus="return-request" />
        </div>
    )
}