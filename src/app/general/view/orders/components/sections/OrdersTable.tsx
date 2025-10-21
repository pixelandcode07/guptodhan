import React from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'
import api from '@/lib/axios'

type ApiOrder = {
    _id: string
    orderId: string
    orderDate?: string
    createdAt?: string
    orderForm?: string
    shippingName?: string
    shippingPhone?: string
    totalAmount?: number
    paymentStatus?: string
    orderStatus?: string
}

export default function OrdersTable({ initialStatus }: { initialStatus?: string }) {
    const [rows, setRows] = React.useState<OrderRow[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        // Map route slug to API status parameter
        const mapSlugToApiStatus = (value: string): string | undefined => {
            switch (value) {
                case 'pending': return 'Pending'
                case 'approved': return 'Processing' // closest available server state
                case 'ready-to-ship': return 'Processing'
                case 'in-transit': return 'Shipped'
                case 'delivered': return 'Delivered'
                case 'cancelled': return 'Cancelled'
                default: return undefined
            }
        }
        
        const apiStatus = initialStatus ? mapSlugToApiStatus(initialStatus.toLowerCase()) : undefined
        const apiUrl = apiStatus ? `/product-order?status=${apiStatus}` : '/product-order'
        
        api.get(apiUrl)
            .then((res) => {
                const list = (res.data?.data ?? []) as ApiOrder[]
                const mapped: OrderRow[] = list.map((o, idx) => ({
                    id: o._id,
                    sl: idx + 1,
                    orderNo: o.orderId,
                    orderDate: new Date(o.orderDate ?? o.createdAt ?? Date.now()).toLocaleDateString('en-GB'),
                    from: o.orderForm || 'Website',
                    name: o.shippingName || '-',
                    phone: o.shippingPhone || '-',
                    total: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
                    payment: o.paymentStatus || '-',
                    status: o.orderStatus || 'Pending',
                }))
                setRows(mapped)
            })
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [initialStatus])

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
                <DataTable columns={ordersColumns} data={rows} />
                {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading orders…</div>}
            </div>
        </div>
    )
}


