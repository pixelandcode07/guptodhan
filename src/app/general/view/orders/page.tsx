import React from 'react'
import OrdersPage from './components/OrdersPage'

type SearchParams = {
    [key: string]: string | string[] | undefined
}

export default function ViewOrdersPage({ searchParams }: { searchParams: SearchParams }) {
    const statusParam = typeof searchParams?.status === 'string' ? searchParams.status : Array.isArray(searchParams?.status) ? searchParams?.status?.[0] : undefined

    return (
        <div className='max-w-[1400px] mx-auto'>
            <OrdersPage initialStatus={statusParam} />
        </div>
    )
}


