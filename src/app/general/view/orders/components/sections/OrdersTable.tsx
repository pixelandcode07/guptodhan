import React, { useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'
import { ColumnDef } from '@tanstack/react-table'
import api from '@/lib/axios'
import FancyLoadingPage from '@/app/general/loading'
import { toast } from 'sonner'
import { FilterState } from './OrdersFilters'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import OrderUpdateModal from './OrderUpdateModal'

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

interface OrdersTableProps {
    initialStatus?: string;
    filters: FilterState; // ✅ প্যারেন্ট থেকে ফিল্টার রিসিভ
    onDataChange?: (data: OrderRow[]) => void;
    onSelectionChange?: (selectedRows: OrderRow[]) => void;
}

export default function OrdersTable({ initialStatus, filters, onDataChange, onSelectionChange }: OrdersTableProps) {
    const [rows, setRows] = React.useState<OrderRow[]>([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [selectedRows, setSelectedRows] = React.useState<OrderRow[]>([])
    
    // Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<{id: string, orderNo: string, orderStatus: string, paymentStatus: string} | null>(null);

    const fetchOrders = React.useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Build Query Params
            const params = new URLSearchParams();
            
            // 1. Initial Page Status (e.g. /ready-to-ship)
            const mapSlugToApiStatus = (value: string): string | undefined => {
                switch (value) {
                    case 'pending': return 'Pending'
                    case 'approved': return 'Processing'
                    case 'ready-to-ship': return 'Processing'
                    case 'in-transit': return 'Shipped'
                    case 'delivered': return 'Delivered'
                    case 'cancelled': return 'Cancelled'
                    case 'return-request': return 'Return Request'
                    default: return undefined
                }
            }
            const apiStatus = initialStatus ? mapSlugToApiStatus(initialStatus.toLowerCase()) : undefined
            if (apiStatus) params.append('orderStatus', apiStatus);

            // 2. Apply Filters form Inputs
            if (filters.orderNo) params.append('orderId', filters.orderNo);
            if (filters.source) params.append('source', filters.source);
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
            if (filters.orderStatus) params.append('orderStatus', filters.orderStatus); // Override initial if selected
            if (filters.customerName) params.append('customerName', filters.customerName);
            if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
            if (filters.deliveryMethod) params.append('deliveryMethod', filters.deliveryMethod);
            if (filters.couponCode) params.append('couponCode', filters.couponCode);
            // Date range filter logic can be added here if needed

            const response = await api.get(`/product-order?${params.toString()}`)
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
            if (onDataChange) onDataChange(mapped)
        } catch (error: any) {
            console.error('Error fetching orders:', error)
            setError('Failed to fetch orders')
            toast.error('Failed to fetch orders')
            setRows([])
        } finally {
            setLoading(false)
        }
    }, [initialStatus, filters, onDataChange])

    React.useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    // ✅ Action Column Definition
    const actionColumn: ColumnDef<OrderRow> = {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedOrderForEdit({
                            id: order.id,
                            orderNo: order.orderNo,
                            orderStatus: order.status,
                            paymentStatus: order.payment
                        });
                        setIsEditOpen(true);
                    }}
                >
                    <Edit className="h-4 w-4 text-blue-600" />
                    <span className="sr-only">Edit</span>
                </Button>
            );
        },
    };

    // Append Action Column to existing columns
    const tableColumns = [...ordersColumns, actionColumn];

    // Checkbox Logic
    React.useEffect(() => {
        const handleCheckboxChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.type === 'checkbox' && target.hasAttribute('data-order-id')) {
                const orderId = target.getAttribute('data-order-id');
                const order = rows.find(row => row.id === orderId);
                if (order) {
                    if (target.checked) {
                        setSelectedRows(prev => {
                            if (!prev.find(r => r.id === order.id)) return [...prev, order];
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
                if (target.checked) setSelectedRows(rows);
                else setSelectedRows([]);
            }
        };

        document.addEventListener('change', handleCheckboxChange);
        document.addEventListener('change', handleSelectAll);

        return () => {
            document.removeEventListener('change', handleCheckboxChange);
            document.removeEventListener('change', handleSelectAll);
        };
    }, [rows]);

    React.useEffect(() => {
        if (onSelectionChange) onSelectionChange(selectedRows);
    }, [selectedRows, onSelectionChange])

    if (loading) return <FancyLoadingPage />;

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-600 mb-4">
                    <p className="text-lg font-semibold">Error Loading Orders</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <DataTable columns={tableColumns} data={rows} />
                {rows.length === 0 && !loading && (
                    <div className="px-3 py-8 text-center text-gray-500">
                        <p>No orders found.</p>
                        <button onClick={fetchOrders} className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            Refresh
                        </button>
                    </div>
                )}
            </div>

            {/* ✅ Update Modal Integration */}
            {selectedOrderForEdit && (
                <OrderUpdateModal 
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    order={selectedOrderForEdit}
                    onSuccess={fetchOrders}
                />
            )}
        </div>
    )
}