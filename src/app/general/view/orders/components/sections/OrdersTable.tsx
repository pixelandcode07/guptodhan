'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { ColumnDef } from '@tanstack/react-table'
import api from '@/lib/axios'
import FancyLoadingPage from '@/app/general/loading'
import { toast } from 'sonner'
import { FilterState } from './OrdersFilters'
import { Button } from '@/components/ui/button'
import { Edit, Info, Eye, Truck, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import OrderUpdateModal from './OrderUpdateModal'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

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
    productTotal?: number
    adminEarned?: number
    vendorNet?: number
    paymentStatus?: string
    orderStatus?: string
    deliveryMethodId?: string
    trackingId?: string
    parcelId?: string
    cancelReason?: string 
    returnReason?: string 
    returnDetails?: string 
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
    searchTerm?: string; 
    startDate?: string; 
    endDate?: string;   
    onDataChange?: (data: OrderRow[]) => void;
    onSelectionChange?: (selectedRows: OrderRow[]) => void;
}

export default function OrdersTable({ 
    initialStatus, filters, searchTerm, startDate, endDate, onDataChange, onSelectionChange 
}: OrdersTableProps) {
    const router = useRouter(); 
    
    const [rows, setRows] = useState<OrderRow[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedRows, setSelectedRows] = useState<OrderRow[]>([])
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<{id: string, orderNo: string, orderStatus: string, paymentStatus: string} | null>(null);

    const [bulkOrderStatus, setBulkOrderStatus] = useState('');
    const [bulkPaymentStatus, setBulkPaymentStatus] = useState('');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<{type: string, reason: string, details?: string} | null>(null);

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
            if (filters.source) params.append('orderForm', filters.source); 
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
            if (filters.orderStatus) params.append('orderStatus', filters.orderStatus); 
            if (filters.customerName) params.append('customerName', filters.customerName);
            if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
            if (filters.deliveryMethod) params.append('deliveryMethod', filters.deliveryMethod);
            
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/product-order?${params.toString()}`)
            const list = (response.data?.data ?? []) as ApiOrder[]
            
            const mapped: any[] = list.map((o, idx) => ({
                id: o._id,
                sl: idx + 1,
                orderNo: o.orderId,
                orderDate: new Date(o.orderDate ?? o.createdAt ?? Date.now()).toLocaleDateString('en-GB'),
                from: o.orderForm || 'Website',
                name: o.shippingName || '-',
                phone: o.shippingPhone || '-',
                email: o.shippingEmail || '-',
                total: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
                deliveryCharge: typeof o.deliveryCharge === 'number' ? o.deliveryCharge : 0,
                productTotal: typeof o.productTotal === 'number' ? o.productTotal : 0,
                adminEarned: typeof o.adminEarned === 'number' ? o.adminEarned : 0,
                vendorEarned: typeof o.vendorNet === 'number' ? o.vendorNet : 0,
                payment: o.paymentStatus || '-',
                status: o.orderStatus || 'Pending',
                deliveryMethod: o.deliveryMethodId || 'COD',
                trackingId: o.trackingId || '-',
                parcelId: o.parcelId || '-',
                cancelReason: o.cancelReason, 
                returnReason: o.returnReason, 
                returnDetails: o.returnDetails, 
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
            
            setRows(mapped as OrderRow[])
            if (onDataChange) onDataChange(mapped as OrderRow[])
        } catch (error: any) {
            console.error('Error fetching orders:', error)
            setError('Failed to fetch orders')
            toast.error('Failed to fetch orders')
            setRows([])
        } finally {
            setLoading(false)
        }
    }, [initialStatus, filters, startDate, endDate, onDataChange])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 500); 
        return () => clearTimeout(timeoutId);
    }, [fetchOrders, filters, startDate, endDate]); 

    const filteredRows = useMemo(() => {
        if (!searchTerm || searchTerm.trim() === '') return rows;
        const q = searchTerm.trim().toLowerCase();
        
        return rows.filter((r) => {
            const searchableFields = [
                r.orderNo,
                r.name,
                r.phone,
                r.status,
                r.payment,
                r.customer?.email,
                r.trackingId,
                r.parcelId
            ];
            return searchableFields.some(field => field && String(field).toLowerCase().includes(q));
        });
    }, [rows, searchTerm]);

    const handleSingleStatusUpdate = async (id: string, newStatus: string) => {
        const toastId = toast.loading(`Updating order status to ${newStatus}...`);
        try {
            await api.patch(`/product-order/${id}`, { orderStatus: newStatus });
            toast.success(`Order status updated to ${newStatus}!`, { id: toastId });
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order status.", { id: toastId });
        }
    };

    const handleBulkDelete = async (rowsToDelete: OrderRow[]) => {
      if (rowsToDelete.length === 0) return;
      
      const isConfirmed = window.confirm(`Are you sure you want to delete ${rowsToDelete.length} orders?`);
      if (!isConfirmed) return;
  
      const toastId = toast.loading(`Deleting ${rowsToDelete.length} orders...`);
  
      try {
        const promises = rowsToDelete.map(row => api.delete(`/product-order/${row.id}`));
        await Promise.all(promises);
  
        toast.success("Orders deleted successfully!", { id: toastId });
        fetchOrders();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete some orders.", { id: toastId });
      }
    };

    // ✅ Action Column with Stop Propagation
    const actionColumn: ColumnDef<OrderRow> = {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
            const order = row.original as any;
            const hasReason = order.cancelReason || order.returnReason;

            return (
                <div className="flex items-center gap-1.5 justify-end">
                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded z-10" 
                        title="View Order"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/general/view/orders/${order.id}`);
                        }}
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Button>

                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-teal-50 text-teal-500 hover:bg-teal-100 hover:text-teal-600 rounded z-10" 
                        title="Mark as Shipped"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSingleStatusUpdate(order.id, 'Shipped');
                        }}
                    >
                        <Truck className="h-3.5 w-3.5" />
                    </Button>

                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 rounded z-10" 
                        title="Approve Order"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSingleStatusUpdate(order.id, 'Processing');
                        }}
                    >
                        <CheckCircle className="h-3.5 w-3.5" />
                    </Button>

                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-600 rounded z-10" 
                        title="Cancel Order"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if(window.confirm('Are you sure you want to cancel this order?')) {
                                handleSingleStatusUpdate(order.id, 'Cancelled');
                            }
                        }}
                    >
                        <XCircle className="h-3.5 w-3.5" />
                    </Button>

                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded z-10" 
                        title="Delete Order"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBulkDelete([order]);
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    {hasReason && (
                        <Button 
                            variant="ghost" size="icon" 
                            className="h-7 w-7 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded z-10" 
                            title="View Reason"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedReason({
                                    type: order.returnReason ? 'Return Request' : 'Cancellation',
                                    reason: order.returnReason || order.cancelReason || 'Not specified',
                                    details: order.returnDetails || ''
                                });
                                setReasonModalOpen(true);
                            }}
                        >
                            <Info className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    
                    <Button 
                        variant="ghost" size="icon" 
                        className="h-7 w-7 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded z-10" 
                        title="Edit Order"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedOrderForEdit({
                                id: order.id,
                                orderNo: order.orderNo,
                                orderStatus: order.status,
                                paymentStatus: order.payment
                            });
                            setIsEditOpen(true);
                        }}
                    >
                        <Edit className="h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
    };

    // ✅ MAGIC FIX: Added Cancel Reason Column dynamically
    const cancelReasonColumn: ColumnDef<OrderRow> = {
        id: "cancelReason",
        header: "CANCEL REASON",
        cell: ({ row }) => {
            const order = row.original as any;
            const reason = order.returnReason || order.cancelReason || '-';
            return (
                <div 
                  className={`text-xs font-medium truncate max-w-[120px] ${reason !== '-' ? 'text-red-500' : 'text-gray-400'}`} 
                  title={reason}
                >
                    {reason}
                </div>
            );
        }
    };

    // Filter duplicate columns and inject the Cancel Reason column before Status
    const filteredColumns = ordersColumns.filter((col: any) => {
        const headerName = col.header?.toString().toLowerCase() || '';
        const idName = col.id?.toString().toLowerCase() || '';
        return !headerName.includes('action') && !idName.includes('action');
    });

    // Insert Cancel Reason right before 'Status'
    let finalColumns = [...filteredColumns];
    const statusIndex = finalColumns.findIndex((col: any) => col.id === 'status' || col.header?.toString().toLowerCase().includes('status'));
    
    if (statusIndex !== -1) {
        finalColumns.splice(statusIndex, 0, cancelReasonColumn);
    } else {
        finalColumns.push(cancelReasonColumn);
    }
    
    // Add the Action column at the very end
    finalColumns.push(actionColumn);

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

    const handleRowSelection = (rows: OrderRow[]) => {
      setSelectedRows(rows);
      if (onSelectionChange) onSelectionChange(rows);
    };

    if (loading && rows.length === 0) return <FancyLoadingPage />;

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
                  columns={finalColumns} 
                  data={filteredRows} 
                  onBulkDelete={handleBulkDelete} 
                  onRowSelectionChange={handleRowSelection} 
                />
                
                {filteredRows.length === 0 && !loading && (
                    <div className="px-3 py-8 text-center text-gray-500">
                        <p>No orders found.</p>
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

            {/* ✅ Reason View Modal */}
            {selectedReason && (
                <Dialog open={reasonModalOpen} onOpenChange={setReasonModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-red-600 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                {selectedReason.type} Details
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-4 bg-red-50/50 rounded-lg border border-red-100 mt-2 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Selected Reason</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedReason.reason}</p>
                            </div>
                            
                            {selectedReason.details && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Additional Details</p>
                                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{selectedReason.details}</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}