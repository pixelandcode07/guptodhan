'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

// Customer type define
export type Customer = {
  avatar: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  date: string;
};

export const customer_data_columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={customer.avatar}
            alt={customer.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-medium">{customer.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'date',
    header: 'Create Date',
  },
];
