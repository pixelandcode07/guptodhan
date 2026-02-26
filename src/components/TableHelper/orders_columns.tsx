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
  payment: string
  status: string
  deliveryMethod?: string
  trackingId?: string
  parcelId?: string
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

// Action handlers component
const SteadfastActions = ({ order }: { order: OrderRow }) => {
  const [loading, setLoading] = useState<string | null>(null)

  // Status Update Function
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
      const errorMsg = error.response?.data?.message || 'Something went wrong. Action failed!';
      toast.error(errorMsg);
    } finally {
      setLoading(null)
    }
  }

  // Delete Order Function
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
      const errorMsg = error.response?.data?.message || 'Error deleting the order!';
      toast.error(errorMsg);
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
      const errorMsg = error.response?.data?.message || 'Failed to create Steadfast parcel';
      toast.error(errorMsg);
    } finally {
      setLoading(null)
    }
  }

  const isSteadfastOrder = order.deliveryMethod?.toLowerCase() === 'steadfast'
  const hasTrackingId = order.trackingId && order.trackingId !== '-'
  const hasParcelId = order.parcelId && order.parcelId !== '-'

  return (
    <div className="flex items-center gap-1">
      {/* View Details Button */}
      <Link
        href={`/general/view/orders/${order.id}`}
        className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
        title="Order details"
      >
        <Eye size={14} />
      </Link>
      
      {/* ==============================================
          STEADFAST DELIVERY METHOD ACTIONS
          ============================================== */}
      {isSteadfastOrder && (
        <>
          {/* Create Steadfast Parcel */}
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
          
          {/* Track Order */}
          {hasTrackingId && (
            <button 
              onClick={handleTrackOrder}
              className="p-1.5 rounded bg-teal-500/10 text-teal-600 hover:bg-teal-500/20" 
              title="Track Order"
            >
              <ExternalLink size={14} />
            </button>
          )}
          
          {/* Order Actions based on Status */}
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
          
          {/* Cancel Order */}
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
      
      {/* ==============================================
          NON-STEADFAST (Regular/COD) DELIVERY ACTIONS
          ============================================== */}
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
    header: () => <input type="checkbox" className="cursor-pointer" />,
    cell: ({ row }) => (
      <input 
        type="checkbox" 
        className="cursor-pointer"
        data-order-id={row.original.id}
      />
    ),
    enableSorting: false,
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
  { 
    accessorKey: "total", 
    header: () => <span>Total</span>,
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return (
        <div className="font-mono text-sm font-semibold text-green-600">
          ৳{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    }
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
    header: () => <span>Tracking ID</span>,
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
    header: () => <span>Parcel ID</span>,
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