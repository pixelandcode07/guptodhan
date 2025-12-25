'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { VendorOrder } from '@/types/VendorOrderTypes';

// export type VendorOrderRow = {
//   _id: string;
//   orderId: string;
//   userName: string;
//   userEmail: string;
//   deliveryMethodId: string;
//   transactionId: string | undefined;
//   deliveryCharge: number;
//   totalAmount: number;
//   orderForm: string;
//   paymentStatus: string;
//   orderStatus: string;
//   quantity: number;
//   unitPrice: number;
//   storeName: string; // we'll add this from store
// };

export type VendorOrderRow = VendorOrder & {
  storeName: string;
  userName: string;
  userEmail: string;
  quantity: number;
  unitPrice: number;
};


export const vendorOrdersColumns: ColumnDef<VendorOrderRow>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: 'storeName',
    header: 'Store Name',
    cell: ({ row }) => <div className="font-medium">{row.original.storeName}</div>,
  },
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.orderId}</div>
    ),
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const { userName, userEmail } = row.original;
      return (
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'deliveryMethodId',
    header: 'Delivery Method',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.deliveryMethodId}</Badge>
    ),
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {row.original.transactionId || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'deliveryCharge',
    header: 'Delivery Charge',
    cell: ({ row }) => (
      <div className="text-right">৳{row.original.deliveryCharge.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => (
      <div className="font-bold text-right">
        ৳{row.original.totalAmount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'orderForm',
    header: 'Order From',
    cell: ({ row }) => <Badge>{row.original.orderForm}</Badge>,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return (
        <Badge variant={status === 'Paid' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'orderStatus',
    header: 'Order Status',
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      const variant =
        status === 'Delivered'
          ? 'default'
          : status === 'Processing'
            ? 'secondary'
            : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'unitPrice',
    header: 'Unit Price',
    cell: ({ row }) => (
      <div className="text-right">
        ৳{row.original.unitPrice.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.quantity}</div>
    ),
  },
];