import React, { useState, useEffect, useCallback } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { ColumnDef } from '@tanstack/react-table'
import api from '@/lib/axios'
import FancyLoadingPage from '@/app/general/loading'
import { toast } from 'sonner'
import { FilterState } from './OrdersFilters'
import { Button } from '@/components/ui/button'
import { Edit, CheckCircle, XCircle } from 'lucide-react'
import OrderUpdateModal from './OrderUpdateModal'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'

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
    filters: FilterState; 
    onDataChange?: (data: OrderRow[]) => void;
    onSelectionChange?: (selectedRows: OrderRow[]) => void;
}

export default function OrdersTable({ initialStatus, filters, onDataChange, onSelectionChange }: OrdersTableProps) {
    const [rows, setRows] = useState<OrderRow[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedRows, setSelectedRows] = useState<OrderRow[]>([])
    
    // Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<{id: string, orderNo: string, orderStatus: string, paymentStatus: string} | null>(null);

    // Bulk Action States
    const [bulkOrderStatus, setBulkOrderStatus] = useState('');
    const [bulkPaymentStatus, setBulkPaymentStatus] = useState('');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const params = new URLSearchParams();
            
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

            if (filters.orderNo) params.append('orderId', filters.orderNo);
            if (filters.source) params.append('source', filters.source);
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
            if (filters.orderStatus) params.append('orderStatus', filters.orderStatus); 
            if (filters.customerName) params.append('customerName', filters.customerName);
            if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
            if (filters.deliveryMethod) params.append('deliveryMethod', filters.deliveryMethod);
            if (filters.couponCode) params.append('couponCode', filters.couponCode);
            
            // ✅ Date Range Logic (YYYY-MM-DD to YYYY-MM-DD)
            if (filters.dateRange) {
                const dates = filters.dateRange.split(' to ');
                if (dates[0]) params.append('startDate', dates[0]);
                if (dates[1]) params.append('endDate', dates[1]);
            }

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

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

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

    const tableColumns = [...ordersColumns, actionColumn];

    // ✅ BULK STATUS UPDATE LOGIC
    const handleBulkStatusUpdate = async () => {
      if (selectedRows.length === 0) return;
      if (!bulkOrderStatus && !bulkPaymentStatus) {
        toast.error("Please select a status to update");
        return;
      }
  
      setIsBulkUpdating(true);
      const toastId = toast.loading(`Updating ${selectedRows.length} orders...`);
  
      try {
        const updateData: any = {};
        if (bulkOrderStatus) updateData.orderStatus = bulkOrderStatus;
        if (bulkPaymentStatus) updateData.paymentStatus = bulkPaymentStatus;
  
        const promises = selectedRows.map(row => 
          api.patch(`/product-order/${row.id}`, updateData)
        );
        
        await Promise.all(promises);
  
        toast.success("Orders updated successfully!", { id: toastId });
        setBulkOrderStatus('');
        setBulkPaymentStatus('');
        fetchOrders();
  
      } catch (error) {
        console.error(error);
        toast.error("Failed to update some orders.", { id: toastId });
      } finally {
        setIsBulkUpdating(false);
      }
    };

    // ✅ BULK DELETE LOGIC (Reused from data-table if needed, but defining here for completeness)
    const handleBulkDelete = async (rowsToDelete: OrderRow[]) => {
      if (rowsToDelete.length === 0) return;
      
      const isConfirmed = window.confirm(`Are you sure you want to delete ${rowsToDelete.length} orders?`);
      if (!isConfirmed) return;
  
      const toastId = toast.loading(`Deleting ${rowsToDelete.length} orders...`);
  
      try {
        const promises = rowsToDelete.map(row => 
          api.delete(`/product-order/${row.id}`)
        );
        
        await Promise.all(promises);
  
        toast.success("Orders deleted successfully!", { id: toastId });
        fetchOrders();
  
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete some orders.", { id: toastId });
      }
    };

    // Keep parent informed of selection
    const handleRowSelection = (rows: OrderRow[]) => {
      setSelectedRows(rows);
      if (onSelectionChange) onSelectionChange(rows);
    };

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

            {/* ✅ Bulk Update Status Bar (Visible only when rows are selected) */}
            {selectedRows.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50 border-b border-blue-100 rounded-t-lg">
                <span className="text-sm font-semibold text-blue-800 bg-white px-2 py-1 rounded shadow-sm">
                  {selectedRows.length} selected
                </span>
                
                <select
                  value={bulkPaymentStatus}
                  onChange={(e) => setBulkPaymentStatus(e.target.value)}
                  className="h-8 text-xs border border-blue-200 rounded px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Payment Status...</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                
                <select
                  value={bulkOrderStatus}
                  onChange={(e) => setBulkOrderStatus(e.target.value)}
                  className="h-8 text-xs border border-blue-200 rounded px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Order Status...</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                
                <Button 
                  size="sm" 
                  onClick={handleBulkStatusUpdate} 
                  disabled={isBulkUpdating || (!bulkPaymentStatus && !bulkOrderStatus)} 
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                >
                  {isBulkUpdating ? 'Applying...' : 'Apply Status'}
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
                <DataTable 
                  columns={tableColumns} 
                  data={rows} 
                  onBulkDelete={handleBulkDelete} 
                  onRowSelectionChange={handleRowSelection} // ✅ Custom prop for data-table if needed, otherwise rely on the cell handlers inside orders_columns
                />
                
                {rows.length === 0 && !loading && (
                    <div className="px-3 py-8 text-center text-gray-500">
                        <p>No orders found.</p>
                        <button onClick={fetchOrders} className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            Refresh
                        </button>
                    </div>
                )}
            </div>

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