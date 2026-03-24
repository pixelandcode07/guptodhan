'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye,
  Truck,
  CheckCircle2,
  CircleX,
  Edit,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';

export type VendorOrderRow = {
  id: string;
  sl: number;
  orderNo: string;
  orderDate: string;
  from: string;
  userName: string;
  phone: string;
  total: number;
  payment: string;
  delivery: string;
  trackingId: string;
  parcelId: string;
  status: string;
};

const ActionButtons = ({ order }: { order: VendorOrderRow }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    try {
      setLoading(newStatus);
      const res = await axios.patch(`/api/v1/product-order/${order.id}`, {
        orderStatus: newStatus,
      });
      if (res.data.success) {
        toast.success(`Order status updated: ${newStatus}`);
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1 justify-center">
      <Link
        href={`/orders/${order.id}`}
        className="p-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
      >
        <Eye size={13} />
      </Link>

      {(order.status === 'Pending' || order.status === 'Processing') && (
        <button
          onClick={() => updateStatus('Shipped')}
          disabled={!!loading}
          className="p-1.5 rounded-md border border-teal-200 bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all"
        >
          {loading === 'Shipped' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Truck size={13} />
          )}
        </button>
      )}

      {order.status === 'Shipped' && (
        <button
          onClick={() => updateStatus('Delivered')}
          disabled={!!loading}
          className="p-1.5 rounded-md border border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
        >
          {loading === 'Delivered' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <CheckCircle2 size={13} />
          )}
        </button>
      )}

      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
        <button
          onClick={() =>
            window.confirm('Cancel this order?') && updateStatus('Cancelled')
          }
          disabled={!!loading}
          className="p-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
        >
          {loading === 'Cancelled' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <CircleX size={13} />
          )}
        </button>
      )}
    </div>
  );
};

export const vendorOrdersColumns: ColumnDef<VendorOrderRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'sl',
    header: 'SL',
    cell: ({ row }) => (
      <span className="text-gray-500 text-xs">{row.original.sl}</span>
    ),
  },
  {
    accessorKey: 'orderNo',
    header: 'Order No',
    cell: ({ row }) => (
      <span className="text-blue-600 font-medium text-xs">
        {row.original.orderNo}
      </span>
    ),
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ row }) => (
      <span className="text-gray-600 text-xs">{row.original.orderDate}</span>
    ),
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <span className="text-gray-600 text-xs">{row.original.from}</span>
    ),
  },
  {
    accessorKey: 'userName',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-semibold text-gray-800 bg-blue-50 px-1.5 py-0.5 rounded text-xs">
        {row.original.userName}
      </span>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <span className="text-gray-600 text-xs">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => (
      <span className="font-bold text-green-600 text-xs">
        ৳{(row.original.total ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'payment',
    header: 'Payment',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 rounded-full text-[10px]"
      >
        {row.original.payment}
      </Badge>
    ),
  },
  {
    accessorKey: 'delivery',
    header: 'Delivery',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px]"
      >
        {row.original.delivery}
      </Badge>
    ),
  },
  {
    accessorKey: 'trackingId',
    header: 'Tracking ID',
    cell: ({ row }) => (
      <span className="text-[11px] text-blue-500 font-mono">
        {row.original.trackingId || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'parcelId',
    header: 'Parcel ID',
    cell: ({ row }) => (
      <span className="text-[11px] text-green-600 font-mono">
        {row.original.parcelId || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      const style =
        s === 'Delivered'
          ? 'bg-green-100 text-green-700 border-green-200'
          : s === 'Shipped'
            ? 'bg-purple-100 text-purple-700 border-purple-200'
            : s === 'Cancelled'
              ? 'bg-red-100 text-red-700 border-red-200'
              : s === 'Processing'
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-amber-100 text-amber-700 border-amber-200';
      return (
        <Badge
          variant="outline"
          className={`${style} rounded-lg px-2 py-0.5 text-[10px]`}
        >
          {s}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ActionButtons order={row.original} />,
  },
];