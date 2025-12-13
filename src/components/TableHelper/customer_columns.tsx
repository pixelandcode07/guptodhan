'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Trash2, Download } from 'lucide-react';

export type Customer = {
  id: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  delete_request_submitted: string;
  wallet: number;
  created_at: string;
};

export const customer_columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Customer"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div className="max-w-xs truncate" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return (
        <div className="max-w-xs truncate" title={email}>
          {email || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string;
      return (
        <div className="max-w-xs truncate" title={phone}>
          {phone || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address = row.getValue('address') as string;
      return (
        <div className="max-w-xs truncate" title={address}>
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: 'delete_request_submitted',
    header: 'Delete Request Submitted',
    cell: ({ row }) => {
      const deleteRequest = row.getValue('delete_request_submitted') as string;
      return <div className="text-sm">{deleteRequest || '-'}</div>;
    },
  },
  {
    accessorKey: 'wallet',
    header: 'Wallet',
    cell: ({ row }) => {
      const wallet = row.getValue('wallet') as number;
      return <div className="text-sm">{wallet}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return <div className="text-sm">{createdAt}</div>;
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
