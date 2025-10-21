import React from 'react'
import { ShoppingCart, TrendingUp, Smile, Trash2 } from 'lucide-react'
import api from '@/lib/axios'

type ApiOrder = {
    totalAmount?: number
    orderStatus?: string
}

function formatAmount(amount: number): string {
    return `৳ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function OrdersStats() {
    const [pendingTotal, setPendingTotal] = React.useState(0)
    const [approvedTotal, setApprovedTotal] = React.useState(0)
    const [deliveredTotal, setDeliveredTotal] = React.useState(0)
    const [cancelledTotal, setCancelledTotal] = React.useState(0)

    React.useEffect(() => {
        // Fetch all orders for statistics
        api.get('/product-order')
            .then((res) => {
                const list = (res.data?.data ?? []) as ApiOrder[]
                let p = 0, a = 0, d = 0, c = 0
                for (const o of list) {
                    const amt = typeof o.totalAmount === 'number' ? o.totalAmount : 0
                    const s = (o.orderStatus || '').toLowerCase()
                    if (s === 'pending') p += amt
                    else if (s === 'processing') a += amt // treat processing as approved
                    else if (s === 'delivered') d += amt
                    else if (s === 'cancelled' || s === 'canceled') c += amt
                }
                setPendingTotal(p)
                setApprovedTotal(a)
                setDeliveredTotal(d)
                setCancelledTotal(c)
            })
            .catch(() => {
                setPendingTotal(0)
                setApprovedTotal(0)
                setDeliveredTotal(0)
                setCancelledTotal(0)
            })
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Pending Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(pendingTotal)}</p>
                <span className='absolute right-3 top-3 text-yellow-500/90'>
                    <ShoppingCart size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Approved Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(approvedTotal)}</p>
                <span className='absolute right-3 top-3 text-blue-500/90'>
                    <TrendingUp size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Delivered Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(deliveredTotal)}</p>
                <span className='absolute right-3 top-3 text-green-600/90'>
                    <Smile size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Cancelled Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(cancelledTotal)}</p>
                <span className='absolute right-3 top-3 text-rose-600/90'>
                    <Trash2 size={18} />
                </span>
            </div>
        </div>
    );
}


