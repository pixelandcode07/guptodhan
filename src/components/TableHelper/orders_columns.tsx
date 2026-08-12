"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Truck, CheckCircle2, Trash2, Package, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import Link from "next/link"

export type OrderRow = {
  id: string
  sl: number
  orderNo: string
  orderDate: string
  from: string
  name: string
  phone: string
  email?: string
  total: number
  deliveryCharge?: number
  productTotal?: number
  adminEarned?: number
  vendorEarned?: number
  payment: string
  status: string
  deliveryMethod?: string
  trackingId?: string
  parcelId?: string
  cancelReason?: string 
  returnReason?: string
  customer?: {
    name: string
    email: string
    phone: string
  }
  store?: {
    name: string
    id: string
  }
}

const SteadfastActions = ({ order }: { order: OrderRow }) => {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSteadfastAction = async (action: string) => {
    try {
      setLoading(action)
      
      const response = await axios.patch(`/api/v1/product-order/${order.id}`, {
        orderStatus: action === 'accept' ? 'Processing' : 
                    action === 'ship' ? 'Shipped' : 
                    action === 'deliver' ? 'Delivered' : 
                    action === 'cancel' ? 'Cancelled' : 'Pending'
      })
      
      if (response.data.success) {
        toast.success(`Order ${action}ed successfully`)
        window.location.reload()
      } else {
        toast.error(response.data.message || `Failed to ${action} order`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Action failed!');
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteOrder = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this order? This action cannot be undone.');
    if (!isConfirmed) return;

    try {
      setLoading('delete')
      const response = await axios.delete(`/api/v1/product-order/${order.id}`);
      
      if (response.data.success) {
        toast.success('Order deleted successfully')
        window.location.reload()
      } else {
        toast.error(response.data.message || 'Failed to delete order')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting the order!');
    } finally {
      setLoading(null)
    }
  }

  const handleTrackOrder = () => {
    if (order.trackingId && order.trackingId !== '-') {
      window.open(`/products/tracking?trackingId=${order.trackingId}`, '_blank')
    } else {
      toast.error('No tracking ID available for this order')
    }
  }

  const handleCreateSteadfastParcel = async () => {
    try {
      setLoading('create')
      const response = await axios.post('/api/v1/product-order/steadfast', {
        orderId: order.orderNo
      })
      
      if (response.data.success) {
        toast.success('Steadfast parcel created successfully')
        window.location.reload()
      } else {
        toast.error(response.data.message || 'Failed to create Steadfast parcel')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create Steadfast parcel');
    } finally {
      setLoading(null)
    }
  }

  const isSteadfastOrder = order.deliveryMethod?.toLowerCase() === 'steadfast'
  const hasTrackingId = order.trackingId && order.trackingId !== '-'
  const hasParcelId = order.parcelId && order.parcelId !== '-'

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/general/view/orders/${order.id}`}
        className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
        title="Order details"
      >
        <Eye size={14} />
      </Link>
      
      {isSteadfastOrder && (
        <>
          {!hasParcelId && (
            <button 
              onClick={handleCreateSteadfastParcel}
              disabled={loading === 'create'}
              className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 disabled:opacity-50" 
              title="Create Steadfast Parcel"
            >
              <Package size={14} />
            </button>
          )}
          
          {hasTrackingId && (
            <button 
              onClick={handleTrackOrder}
              className="p-1.5 rounded bg-teal-500/10 text-teal-600 hover:bg-teal-500/20" 
              title="Track Order"
            >
              <ExternalLink size={14} />
            </button>
          )}
          
          {order.status === 'Pending' && (
            <button 
              onClick={() => handleSteadfastAction('accept')}
              disabled={loading === 'accept'}
              className="p-1.5 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20 disabled:opacity-50" 
              title="Accept Order"
            >
              <CheckCircle2 size={14} />
            </button>
          )}
          
          {order.status === 'Processing' && (
            <button 
              onClick={() => handleSteadfastAction('ship')}
              disabled={loading === 'ship'}
              className="p-1.5 rounded bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 disabled:opacity-50" 
              title="Ship Order"
            >
              <Truck size={14} />
            </button>
          )}
          
          {order.status === 'Shipped' && (
            <button 
              onClick={() => handleSteadfastAction('deliver')}
              disabled={loading === 'deliver'}
              className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50" 
              title="Mark as Delivered"
            >
              <CheckCircle2 size={14} />
            </button>
          )}
          
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <button 
              onClick={() => handleSteadfastAction('cancel')}
              disabled={loading === 'cancel'}
              className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20 disabled:opacity-50" 
              title="Cancel Order"
            >
              <Trash2 size={14} />
            </button>
          )}
        </>
      )}
      
      {!isSteadfastOrder && (
        <>
          <button 
            onClick={() => handleSteadfastAction('ship')}
            disabled={loading === 'ship'}
            className="p-1.5 rounded bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 disabled:opacity-50" 
            title="Mark as Shipped"
          >
            <Truck size={14} />
          </button>
          
          <button 
            onClick={() => handleSteadfastAction('deliver')}
            disabled={loading === 'deliver'}
            className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50" 
            title="Mark as Delivered"
          >
            <CheckCircle2 size={14} />
          </button>
          
          <button 
            onClick={handleDeleteOrder}
            disabled={loading === 'delete'}
            className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20 disabled:opacity-50" 
            title="Delete Order"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  )
}

export const ordersColumns: ColumnDef<OrderRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "sl", header: () => <span>SL</span> },
  { 
    accessorKey: "orderNo", 
    header: () => <span>Order No</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-blue-600">
        {row.getValue("orderNo")}
      </div>
    )
  },
  { accessorKey: "orderDate", header: () => <span>Order Date</span> },
  { accessorKey: "from", header: () => <span>From</span> },
  { 
    accessorKey: "name", 
    header: () => <span>Name</span>,
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("name") as string}>
        {row.getValue("name")}
      </div>
    )
  },
  { 
    accessorKey: "phone", 
    header: () => <span>Phone</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.getValue("phone")}
      </div>
    )
  },
  
  // ✅ 1. Product Price Column
  { 
    accessorKey: "productTotal", 
    header: () => <span className="whitespace-nowrap">Product Price</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-700">
        ৳{Number(row.getValue("productTotal") || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    )
  },

  // ✅ 2. Delivery Charge Column
  { 
    accessorKey: "deliveryCharge", 
    header: () => <span className="whitespace-nowrap">Delivery Price</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-orange-600">
        ৳{Number(row.getValue("deliveryCharge") || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    )
  },

  // Existing Total
  { 
    accessorKey: "total", 
    header: () => <span>Total</span>,
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return (
        <div className="font-mono text-sm font-bold text-green-600">
          ৳{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    }
  },

  // ✅ 3. Admin Earn Column
  { 
    accessorKey: "adminEarned", 
    header: () => <span className="whitespace-nowrap text-blue-600">Admin Earn</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-center border border-blue-100">
        ৳{Number(row.getValue("adminEarned") || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    )
  },

  // ✅ 4. Vendor Earn Column
  { 
    accessorKey: "vendorEarned", 
    header: () => <span className="whitespace-nowrap text-purple-600">Vendor Sell</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-center border border-purple-100">
        ৳{Number(row.getValue("vendorEarned") || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    )
  },

  { 
    accessorKey: "payment", 
    header: () => <span>Payment</span>,
    cell: ({ row }) => {
      const payment = row.getValue("payment") as string;
      const isPaid = payment.toLowerCase().includes('paid') || payment.toLowerCase().includes('success');
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {payment}
        </span>
      );
    }
  },
  { 
    accessorKey: "deliveryMethod", 
    header: () => <span>Delivery</span>,
    cell: ({ row }) => {
      const method = row.getValue("deliveryMethod") as string;
      const isCOD = method?.toLowerCase() === 'cod';
      const isSteadfast = method?.toLowerCase() === 'steadfast';
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isCOD ? "bg-orange-100 text-orange-800" : 
          isSteadfast ? "bg-purple-100 text-purple-800" : 
          "bg-blue-100 text-blue-800"
        }`}>
          {method || 'COD'}
        </span>
      );
    }
  },
  { 
    accessorKey: "trackingId", 
    header: () => <span className="whitespace-nowrap">Tracking ID</span>,
    cell: ({ row }) => {
      const trackingId = row.getValue("trackingId") as string;
      return (
        <div className="font-mono text-xs">
          {trackingId === '-' ? (
            <span className="text-gray-400">N/A</span>
          ) : (
            <span className="text-blue-600">{trackingId}</span>
          )}
        </div>
      );
    }
  },
  { 
    accessorKey: "parcelId", 
    header: () => <span className="whitespace-nowrap">Parcel ID</span>,
    cell: ({ row }) => {
      const parcelId = row.getValue("parcelId") as string;
      return (
        <div className="font-mono text-xs">
          {parcelId === '-' ? (
            <span className="text-gray-400">N/A</span>
          ) : (
            <span className="text-green-600">{parcelId}</span>
          )}
        </div>
      );
    }
  },
  { 
    accessorKey: "returnReason", 
    header: () => <span className="text-orange-500 font-semibold whitespace-nowrap">Return Reason</span>,
    cell: ({ row }) => {
      const returnReason = (row.original as any).returnReason as string;
      
      if (!returnReason || returnReason === '-') {
        return <span className="text-gray-400 text-xs">-</span>;
      }

      return (
        <div className="text-xs text-orange-600 font-medium max-w-[150px] whitespace-normal" title={returnReason}>
          {returnReason}
        </div>
      );
    }
  },
  { 
    accessorKey: "cancelReason", 
    header: () => <span className="text-red-500 font-semibold whitespace-nowrap">Cancel Reason</span>,
    cell: ({ row }) => {
      const cancelReason = row.getValue("cancelReason") as string;
      
      if (!cancelReason || cancelReason === '-') {
        return <span className="text-gray-400 text-xs">-</span>;
      }

      return (
        <div className="text-xs text-red-600 font-medium max-w-[150px] whitespace-normal" title={cancelReason}>
          {cancelReason}
        </div>
      );
    }
  },
  { 
    accessorKey: "status", 
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
          case 'pending': return "bg-yellow-100 text-yellow-800";
          case 'processing': return "bg-blue-100 text-blue-800";
          case 'shipped': return "bg-purple-100 text-purple-800";
          case 'delivered': return "bg-green-100 text-green-800";
          case 'cancelled': return "bg-red-100 text-red-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}>
          {status}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: ({ row }) => <SteadfastActions order={row.original} />,
    enableSorting: false,
  },
]