import React from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'
import api from '@/lib/axios'
import FancyLoadingPage from '@/app/general/loading'
import { toast } from 'sonner'

type ApiOrder = {
    _id: string
    orderId: string
    orderDate?: string
    createdAt?: string
    orderForm?: string
    shippingName?: string
    shippingPhone?: string
    shippingEmail?: string
    totalAmount?: number
    deliveryCharge?: number
    paymentStatus?: string
    orderStatus?: string
    deliveryMethodId?: string
    trackingId?: string
    parcelId?: string
    userId?: {
        _id: string
        name: string
        email: string
        phoneNumber: string
    }
    storeId?: {
        _id: string
        storeName: string
    }
}

export default function OrdersTable({ initialStatus, onDataChange, onSelectionChange }: { initialStatus?: string; onDataChange?: (data: OrderRow[]) => void; onSelectionChange?: (selectedRows: OrderRow[]) => void }) {
    const [rows, setRows] = React.useState<OrderRow[]>([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [selectedRows, setSelectedRows] = React.useState<OrderRow[]>([])

    const fetchOrders = React.useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
          
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
            
            const response = await api.get(apiUrl)
            const list = (response.data?.data ?? []) as ApiOrder[]
            
            const mapped: OrderRow[] = list.map((o, idx) => ({
                id: o._id,
                sl: idx + 1,
                orderNo: o.orderId,
                orderDate: new Date(o.orderDate ?? o.createdAt ?? Date.now()).toLocaleDateString('en-GB'),
                from: o.orderForm || 'Website',
                name: o.shippingName || '-',
                phone: o.shippingPhone || '-',
                email: o.shippingEmail || '-',
                total: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
                deliveryCharge: typeof o.deliveryCharge === 'number' ? o.deliveryCharge : undefined,
                payment: o.paymentStatus || '-',
                status: o.orderStatus || 'Pending',
                deliveryMethod: o.deliveryMethodId || 'COD',
                trackingId: o.trackingId || '-',
                parcelId: o.parcelId || '-',
                customer: o.userId ? {
                    name: o.userId.name || '-',
                    email: o.userId.email || '-',
                    phone: o.userId.phoneNumber || '-'
                } : undefined,
                store: o.storeId ? {
                    name: o.storeId.storeName || '-',
                    id: o.storeId._id
                } : undefined,
            }))
            
            setRows(mapped)
            
            // Notify parent component of data change
            if (onDataChange) {
                onDataChange(mapped)
            }
        } catch (error: unknown) {
            console.error('Error fetching orders:', error)
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch orders'
                : 'Failed to fetch orders'
            setError(errorMessage)
            toast.error('Failed to fetch orders')
            setRows([])
        } finally {
            setLoading(false)
        }
    }, [initialStatus, onDataChange])

    React.useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    // Track checkbox selections using DOM events
    React.useEffect(() => {
        const handleCheckboxChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.type === 'checkbox' && target.hasAttribute('data-order-id')) {
                const orderId = target.getAttribute('data-order-id');
                const order = rows.find(row => row.id === orderId);
                
                if (order) {
                    if (target.checked) {
                        setSelectedRows(prev => {
                            if (!prev.find(r => r.id === order.id)) {
                                return [...prev, order];
                            }
                            return prev;
                        });
                    } else {
                        setSelectedRows(prev => prev.filter(row => row.id !== order.id));
                    }
                }
            }
        };

        const handleSelectAll = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const headerCheckbox = document.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
            
            if (headerCheckbox && target === headerCheckbox) {
                if (target.checked) {
                    setSelectedRows(rows);
                } else {
                    setSelectedRows([]);
                }
            }
        };

        document.addEventListener('change', handleCheckboxChange);
        document.addEventListener('change', handleSelectAll);

        return () => {
            document.removeEventListener('change', handleCheckboxChange);
            document.removeEventListener('change', handleSelectAll);
        };
    }, [rows]);

    // Notify parent of selection changes
    React.useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedRows);
        }
    }, [selectedRows, onSelectionChange])

    if (loading) {
        return <FancyLoadingPage />;
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-600 mb-4">
                    <p className="text-lg font-semibold">Error Loading Orders</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button 
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <DataTable columns={ordersColumns} data={rows} />
                    {rows.length === 0 && !loading && (
                        <div className="px-3 py-8 text-center text-gray-500">
                            <p>No orders found.</p>
                            <button 
                                onClick={fetchOrders}
                                className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


